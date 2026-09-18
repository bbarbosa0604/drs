import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';

import { GeneratedDocumentKind } from '../../common/enums/generated-document-kind.enum';
import { SgsiScopeVersionStatus } from '../../common/enums/sgsi-scope-version-status.enum';
import { OrganizationEntity } from '../organizations/entities/organization.entity';
import { ProjectEntity } from '../projects/entities/project.entity';
import { ScopeApprovalEntity } from '../sgsi-scope/limits/entities/scope-approval.entity';
import { ScopeDefinitionEntity } from '../sgsi-scope/scope-definition/entities/scope-definition.entity';
import { SgsiScopeVersionEntity } from '../sgsi-scope/entities/sgsi-scope-version.entity';
import { SgsiScopeEntity } from '../sgsi-scope/entities/sgsi-scope.entity';
import { GeneratedDocumentEntity } from './entities/generated-document.entity';
import {
  DOCUMENT_STORAGE_ADAPTER,
  type DocumentStorageAdapter,
} from './storage/document-storage.interface';
import { renderApprovalPresentationPptx } from './templates/approval-presentation.template';
import { renderApprovalProposalDocx } from './templates/approval-proposal.template';
import { type DocumentContext } from './templates/document-context';
import { renderScopeDeclarationDocx } from './templates/scope-declaration.template';

export interface GeneratedDocumentFile {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
}

const DOCX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const PPTX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.presentationml.presentation';

/** PRD secao 17/44 - geracao desacoplada da UI, templates isolados do dominio. */
@Injectable()
export class DocumentGenerationService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(SgsiScopeVersionEntity)
    private readonly sgsiScopeVersionsRepository: Repository<SgsiScopeVersionEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly organizationsRepository: Repository<OrganizationEntity>,
    @InjectRepository(ScopeDefinitionEntity)
    private readonly scopeDefinitionsRepository: Repository<ScopeDefinitionEntity>,
    @InjectRepository(ScopeApprovalEntity)
    private readonly approvalsRepository: Repository<ScopeApprovalEntity>,
    @InjectRepository(GeneratedDocumentEntity)
    private readonly generatedDocumentsRepository: Repository<GeneratedDocumentEntity>,
    @Inject(DOCUMENT_STORAGE_ADAPTER)
    private readonly storage: DocumentStorageAdapter,
  ) {}

  async generateScopeDeclaration(
    projectId: string,
  ): Promise<GeneratedDocumentEntity> {
    const { sgsiScopeId, context } = await this.buildContext(projectId);
    const buffer = await renderScopeDeclarationDocx(context);

    return this.persist(
      sgsiScopeId,
      GeneratedDocumentKind.SCOPE_DECLARATION,
      buffer,
      'declaracao-de-escopo.docx',
      DOCX_MIME_TYPE,
    );
  }

  async generateApprovalProposal(
    projectId: string,
  ): Promise<GeneratedDocumentEntity> {
    const { sgsiScopeId, context } = await this.buildContext(projectId);
    const buffer = await renderApprovalProposalDocx(context);

    return this.persist(
      sgsiScopeId,
      GeneratedDocumentKind.APPROVAL_PROPOSAL,
      buffer,
      'proposta-de-aprovacao.docx',
      DOCX_MIME_TYPE,
    );
  }

  async generateApprovalPresentation(
    projectId: string,
  ): Promise<GeneratedDocumentEntity> {
    const { sgsiScopeId, context } = await this.buildContext(projectId);
    const buffer = await renderApprovalPresentationPptx(context);

    return this.persist(
      sgsiScopeId,
      GeneratedDocumentKind.APPROVAL_PRESENTATION,
      buffer,
      'apresentacao-para-aprovacao.pptx',
      PPTX_MIME_TYPE,
    );
  }

  async getDocumentFile(
    projectId: string,
    documentId: string,
  ): Promise<GeneratedDocumentFile> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const document = await this.generatedDocumentsRepository.findOne({
      where: { id: documentId, sgsiScopeId },
    });

    if (!document) {
      throw new NotFoundException('Generated document not found.');
    }

    const buffer = await this.storage.getObject(document.storageKey);

    return { buffer, fileName: document.fileName, mimeType: document.mimeType };
  }

  private async persist(
    sgsiScopeId: string,
    kind: GeneratedDocumentKind,
    buffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<GeneratedDocumentEntity> {
    const storageKey = `${sgsiScopeId}/${randomUUID()}-${fileName}`;

    // So persiste o registro depois do upload confirmado - nunca marcar
    // "gerado" se o storage falhar (PRD - Task 026, casos de erro).
    await this.storage.putObject(storageKey, buffer, mimeType);

    return this.generatedDocumentsRepository.save(
      this.generatedDocumentsRepository.create({
        sgsiScopeId,
        kind,
        fileName,
        mimeType,
        storageKey,
      }),
    );
  }

  private async buildContext(
    projectId: string,
  ): Promise<{ sgsiScopeId: string; context: DocumentContext }> {
    const sgsiScope = await this.sgsiScopesRepository.findOne({
      where: { projectId },
    });

    if (!sgsiScope) {
      throw new NotFoundException(
        'SGSI Scope module has not been activated for this project.',
      );
    }

    const [project, currentVersion, scopeDefinition, approval] =
      await Promise.all([
        this.projectsRepository.findOne({ where: { id: projectId } }),
        this.sgsiScopeVersionsRepository.findOne({
          where: { sgsiScopeId: sgsiScope.id },
          order: { versionNumber: 'DESC' },
        }),
        this.scopeDefinitionsRepository.findOne({
          where: { sgsiScopeId: sgsiScope.id },
        }),
        this.approvalsRepository.findOne({
          where: { sgsiScopeId: sgsiScope.id },
        }),
      ]);

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if (!scopeDefinition?.formalDeclaration?.trim()) {
      throw new BadRequestException(
        'The formal scope declaration (Etapa 4) must be filled in before generating a document.',
      );
    }

    const organization = await this.organizationsRepository.findOne({
      where: { id: project.organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    return {
      sgsiScopeId: sgsiScope.id,
      context: {
        organizationName: organization.name,
        projectName: project.name,
        versionNumber: currentVersion?.versionNumber ?? 1,
        versionStatus:
          currentVersion?.status === SgsiScopeVersionStatus.APPROVED
            ? 'APPROVED'
            : 'DRAFT',
        scopeDefinition,
        approval: approval ?? null,
      },
    };
  }

  private async resolveSgsiScopeId(projectId: string): Promise<string> {
    const sgsiScope = await this.sgsiScopesRepository.findOne({
      where: { projectId },
    });

    if (!sgsiScope) {
      throw new NotFoundException(
        'SGSI Scope module has not been activated for this project.',
      );
    }

    return sgsiScope.id;
  }
}
