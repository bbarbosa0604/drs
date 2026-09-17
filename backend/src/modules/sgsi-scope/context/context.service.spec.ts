import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { ContextAspectType } from '../../../common/enums/context-aspect-type.enum';
import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { ContextService } from './context.service';
import { type ContextAspectEntity } from './entities/context-aspect.entity';
import { type OrganizationContextEntity } from './entities/organization-context.entity';

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    create: jest.fn((input: Partial<T>) => input as T),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
    remove: jest.fn((entity: unknown) => Promise.resolve(entity)),
  };
}

function buildService() {
  const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
  const organizationContextsRepository =
    buildRepositoryMock<OrganizationContextEntity>();
  const contextAspectsRepository = buildRepositoryMock<ContextAspectEntity>();

  const service = new ContextService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    organizationContextsRepository as unknown as Repository<OrganizationContextEntity>,
    contextAspectsRepository as unknown as Repository<ContextAspectEntity>,
  );

  return {
    service,
    sgsiScopesRepository,
    organizationContextsRepository,
    contextAspectsRepository,
  };
}

describe('ContextService', () => {
  it('throws NotFoundException when the module has not been activated for the project', async () => {
    const { service, sgsiScopesRepository } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue(null);

    await expect(service.getSection('project-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('strips <script> and event handlers from the history HTML before persisting (XSS)', async () => {
    const { service, sgsiScopesRepository, organizationContextsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    organizationContextsRepository.findOne.mockResolvedValue(null);

    const malicious =
      '<p onclick="alert(1)">Historico</p><script>alert(1)</script><img src=x onerror=alert(1)>';

    await service.updateHistory('project-1', { historyHtml: malicious });

    const saved = organizationContextsRepository.save.mock.calls[0][0] as {
      history: { html: string };
    };

    expect(saved.history.html).not.toContain('<script>');
    expect(saved.history.html).not.toContain('onclick');
    expect(saved.history.html).not.toContain('onerror');
    expect(saved.history.html).not.toContain('<img');
    expect(saved.history.html).toContain('Historico');
  });

  it('strips a javascript: URL from an anchor href', async () => {
    const { service, sgsiScopesRepository, organizationContextsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    organizationContextsRepository.findOne.mockResolvedValue(null);

    await service.updateHistory('project-1', {
      historyHtml: '<a href="javascript:alert(1)">click</a>',
    });

    const saved = organizationContextsRepository.save.mock.calls[0][0] as {
      history: { html: string };
    };

    expect(saved.history.html).not.toContain('javascript:');
  });

  it('creates a context aspect scoped to the project SgsiScope', async () => {
    const { service, sgsiScopesRepository, contextAspectsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);

    await service.createAspect('project-1', {
      type: ContextAspectType.EXTERNAL,
      title: 'Concorrencia',
    });

    expect(contextAspectsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        type: ContextAspectType.EXTERNAL,
        title: 'Concorrencia',
      }),
    );
  });

  it('throws NotFoundException when updating an aspect that does not exist', async () => {
    const { service, sgsiScopesRepository, contextAspectsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    contextAspectsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.updateAspect('project-1', 'aspect-missing', { title: 'Novo' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
