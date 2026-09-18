import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { SgsiScopeVersionStatus } from '../../common/enums/sgsi-scope-version-status.enum';
import { type OrganizationEntity } from '../organizations/entities/organization.entity';
import { type ProjectEntity } from '../projects/entities/project.entity';
import { type ScopeApprovalEntity } from '../sgsi-scope/limits/entities/scope-approval.entity';
import { type ScopeDefinitionEntity } from '../sgsi-scope/scope-definition/entities/scope-definition.entity';
import { type SgsiScopeVersionEntity } from '../sgsi-scope/entities/sgsi-scope-version.entity';
import { type SgsiScopeEntity } from '../sgsi-scope/entities/sgsi-scope.entity';
import { DocumentGenerationService } from './document-generation.service';
import { type GeneratedDocumentEntity } from './entities/generated-document.entity';
import { type DocumentStorageAdapter } from './storage/document-storage.interface';

/**
 * `pptxgenjs` usa `import()` dinamico internamente (mesmo sem midia nos
 * slides) para resolver dependencias opcionais de Node - isso quebra sob
 * ts-jest sem `--experimental-vm-modules`. E uma limitacao do ambiente de
 * teste, nao um bug de producao (a API Nest roda em Node puro, sem
 * ts-jest); mockamos so o template para testar a orquestracao do service.
 * A abertura real do .pptx gerado e validacao manual (Task 026).
 */
jest.mock('./templates/approval-presentation.template', () => ({
  renderApprovalPresentationPptx: jest
    .fn()
    .mockResolvedValue(Buffer.from('pptx')),
}));

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    create: jest.fn((input: Partial<T>) => input as T),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
  };
}

function buildService() {
  const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
  const sgsiScopeVersionsRepository =
    buildRepositoryMock<SgsiScopeVersionEntity>();
  const projectsRepository = buildRepositoryMock<ProjectEntity>();
  const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
  const scopeDefinitionsRepository =
    buildRepositoryMock<ScopeDefinitionEntity>();
  const approvalsRepository = buildRepositoryMock<ScopeApprovalEntity>();
  const generatedDocumentsRepository =
    buildRepositoryMock<GeneratedDocumentEntity>();
  const storage = {
    putObject: jest
      .fn<Promise<void>, [string, Buffer, string]>()
      .mockResolvedValue(undefined),
    getObject: jest.fn<Promise<Buffer>, [string]>(),
  };

  const service = new DocumentGenerationService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    sgsiScopeVersionsRepository as unknown as Repository<SgsiScopeVersionEntity>,
    projectsRepository as unknown as Repository<ProjectEntity>,
    organizationsRepository as unknown as Repository<OrganizationEntity>,
    scopeDefinitionsRepository as unknown as Repository<ScopeDefinitionEntity>,
    approvalsRepository as unknown as Repository<ScopeApprovalEntity>,
    generatedDocumentsRepository as unknown as Repository<GeneratedDocumentEntity>,
    storage as unknown as DocumentStorageAdapter,
  );

  return {
    service,
    sgsiScopesRepository,
    sgsiScopeVersionsRepository,
    projectsRepository,
    organizationsRepository,
    scopeDefinitionsRepository,
    approvalsRepository,
    generatedDocumentsRepository,
    storage,
  };
}

function mockHappyPath(mocks: ReturnType<typeof buildService>) {
  mocks.sgsiScopesRepository.findOne.mockResolvedValue({
    id: 'sgsi-scope-1',
  } as SgsiScopeEntity);
  mocks.projectsRepository.findOne.mockResolvedValue({
    id: 'project-1',
    name: 'Projeto X',
    organizationId: 'org-1',
  } as ProjectEntity);
  mocks.organizationsRepository.findOne.mockResolvedValue({
    id: 'org-1',
    name: 'Organizacao X',
  } as OrganizationEntity);
  mocks.sgsiScopeVersionsRepository.findOne.mockResolvedValue({
    versionNumber: 2,
    status: SgsiScopeVersionStatus.DRAFT,
  } as SgsiScopeVersionEntity);
  mocks.scopeDefinitionsRepository.findOne.mockResolvedValue({
    formalDeclaration: 'O escopo cobre X, Y e Z.',
    executiveJustification: 'Justificativa executiva.',
  } as ScopeDefinitionEntity);
  mocks.approvalsRepository.findOne.mockResolvedValue(null);
}

describe('DocumentGenerationService', () => {
  it('rejects generation when the formal scope declaration is missing (400, PRD - casos de erro)', async () => {
    const mocks = buildService();
    mockHappyPath(mocks);
    mocks.scopeDefinitionsRepository.findOne.mockResolvedValue(null);

    await expect(
      mocks.service.generateScopeDeclaration('project-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(mocks.storage.putObject).not.toHaveBeenCalled();
  });

  it('rejects generation when the module has not been activated for the project', async () => {
    const mocks = buildService();
    mocks.sgsiScopesRepository.findOne.mockResolvedValue(null);

    await expect(
      mocks.service.generateScopeDeclaration('project-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('generates a DOCX scope declaration and only persists after the upload succeeds', async () => {
    const mocks = buildService();
    mockHappyPath(mocks);

    const result = await mocks.service.generateScopeDeclaration('project-1');

    expect(mocks.storage.putObject).toHaveBeenCalledWith(
      expect.stringContaining('sgsi-scope-1/'),
      expect.any(Buffer),
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    expect(mocks.generatedDocumentsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        fileName: 'declaracao-de-escopo.docx',
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({ fileName: 'declaracao-de-escopo.docx' }),
    );
  });

  it('never persists the document record when the storage upload fails', async () => {
    const mocks = buildService();
    mockHappyPath(mocks);
    mocks.storage.putObject.mockRejectedValueOnce(new Error('storage down'));

    await expect(
      mocks.service.generateScopeDeclaration('project-1'),
    ).rejects.toThrow('storage down');
    expect(mocks.generatedDocumentsRepository.save).not.toHaveBeenCalled();
  });

  it('generates a PPTX approval presentation', async () => {
    const mocks = buildService();
    mockHappyPath(mocks);

    const result =
      await mocks.service.generateApprovalPresentation('project-1');

    expect(mocks.storage.putObject).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Buffer),
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    );
    expect(result).toEqual(
      expect.objectContaining({ fileName: 'apresentacao-para-aprovacao.pptx' }),
    );
  });

  it('throws NotFoundException when downloading a document from another scope', async () => {
    const mocks = buildService();
    mocks.sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    mocks.generatedDocumentsRepository.findOne.mockResolvedValue(null);

    await expect(
      mocks.service.getDocumentFile('project-1', 'other-scope-document'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
