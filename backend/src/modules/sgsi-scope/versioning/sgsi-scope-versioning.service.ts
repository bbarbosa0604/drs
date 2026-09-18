import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditAction } from '../../../common/enums/audit-action.enum';
import { SgsiScopeVersionStatus } from '../../../common/enums/sgsi-scope-version-status.enum';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { ProjectEntity } from '../../projects/entities/project.entity';
import { SgsiScopeVersionEntity } from '../entities/sgsi-scope-version.entity';
import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';

/**
 * Versionamento do escopo (PRD secao 20/44, Task 027): "uma versao aprovada
 * nao deve ser silenciosamente sobrescrita". A garantia vive aqui, no
 * service, nunca so na UI — `requestEditableVersion` e o unico caminho para
 * obter uma versao em que se pode escrever, e ele mesmo decide se reusa a
 * versao `DRAFT` atual ou cria uma nova a partir de uma versao `APPROVED`.
 */
@Injectable()
export class SgsiScopeVersioningService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(SgsiScopeVersionEntity)
    private readonly versionsRepository: Repository<SgsiScopeVersionEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async listVersions(projectId: string): Promise<SgsiScopeVersionEntity[]> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.versionsRepository.find({
      where: { sgsiScopeId },
      order: { versionNumber: 'ASC' },
    });
  }

  /**
   * Ponto de entrada obrigatorio antes de qualquer edicao relevante do
   * escopo. Se a versao atual estiver `DRAFT`, devolve ela mesma (edicao
   * comum). Se estiver `APPROVED`, cria e devolve uma nova versao `DRAFT`
   * (versionNumber + 1) em vez de reabrir/sobrescrever a aprovada.
   */
  async requestEditableVersion(
    projectId: string,
    userId: string,
  ): Promise<SgsiScopeVersionEntity> {
    const sgsiScope = await this.resolveSgsiScope(projectId);
    const currentVersion = await this.getCurrentVersion(sgsiScope.id);

    if (currentVersion.status === SgsiScopeVersionStatus.DRAFT) {
      return currentVersion;
    }

    const newVersion = await this.versionsRepository.save(
      this.versionsRepository.create({
        sgsiScopeId: sgsiScope.id,
        versionNumber: currentVersion.versionNumber + 1,
        status: SgsiScopeVersionStatus.DRAFT,
      }),
    );

    await this.auditLogService.record({
      organizationId: sgsiScope.project.organizationId,
      projectId,
      userId,
      entity: 'SgsiScopeVersion',
      entityId: newVersion.id,
      action: AuditAction.CREATE,
      metadata: { previousVersionNumber: currentVersion.versionNumber },
    });

    return newVersion;
  }

  async approveCurrentVersion(
    projectId: string,
    userId: string,
  ): Promise<SgsiScopeVersionEntity> {
    const sgsiScope = await this.resolveSgsiScope(projectId);
    const currentVersion = await this.getCurrentVersion(sgsiScope.id);

    if (currentVersion.status === SgsiScopeVersionStatus.APPROVED) {
      throw new ConflictException('This version has already been approved.');
    }

    currentVersion.status = SgsiScopeVersionStatus.APPROVED;
    const approvedVersion = await this.versionsRepository.save(currentVersion);

    await this.auditLogService.record({
      organizationId: sgsiScope.project.organizationId,
      projectId,
      userId,
      entity: 'SgsiScopeVersion',
      entityId: approvedVersion.id,
      action: AuditAction.APPROVED,
      metadata: { versionNumber: approvedVersion.versionNumber },
    });

    return approvedVersion;
  }

  private async getCurrentVersion(
    sgsiScopeId: string,
  ): Promise<SgsiScopeVersionEntity> {
    const currentVersion = await this.versionsRepository.findOne({
      where: { sgsiScopeId },
      order: { versionNumber: 'DESC' },
    });

    if (!currentVersion) {
      throw new NotFoundException('No version found for this SGSI Scope.');
    }

    return currentVersion;
  }

  private async resolveSgsiScope(
    projectId: string,
  ): Promise<SgsiScopeEntity & { project: ProjectEntity }> {
    const sgsiScope = await this.sgsiScopesRepository.findOne({
      where: { projectId },
    });

    if (!sgsiScope) {
      throw new NotFoundException(
        'SGSI Scope module has not been activated for this project.',
      );
    }

    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    return { ...sgsiScope, project };
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
