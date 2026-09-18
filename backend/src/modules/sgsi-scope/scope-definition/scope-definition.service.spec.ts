import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { type ScopeBenefitEntity } from './entities/scope-benefit.entity';
import { type ScopeCharacteristicEntity } from './entities/scope-characteristic.entity';
import { type ScopeDefinitionEntity } from './entities/scope-definition.entity';
import { ScopeDefinitionService } from './scope-definition.service';

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
  const scopeDefinitionsRepository =
    buildRepositoryMock<ScopeDefinitionEntity>();
  const characteristicsRepository =
    buildRepositoryMock<ScopeCharacteristicEntity>();
  const benefitsRepository = buildRepositoryMock<ScopeBenefitEntity>();

  const service = new ScopeDefinitionService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    scopeDefinitionsRepository as unknown as Repository<ScopeDefinitionEntity>,
    characteristicsRepository as unknown as Repository<ScopeCharacteristicEntity>,
    benefitsRepository as unknown as Repository<ScopeBenefitEntity>,
  );

  return {
    service,
    sgsiScopesRepository,
    scopeDefinitionsRepository,
    characteristicsRepository,
    benefitsRepository,
  };
}

describe('ScopeDefinitionService', () => {
  it('creates the ScopeDefinition lazily on the first autosave', async () => {
    const { service, sgsiScopesRepository, scopeDefinitionsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    scopeDefinitionsRepository.findOne.mockResolvedValue(null);

    await service.updateDefinition('project-1', {
      formalDeclaration: 'Declaracao formal.',
    });

    expect(scopeDefinitionsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        formalDeclaration: 'Declaracao formal.',
      }),
    );
  });

  it('sanitizes the detailed description HTML before persisting (XSS)', async () => {
    const { service, sgsiScopesRepository, scopeDefinitionsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    scopeDefinitionsRepository.findOne.mockResolvedValue(null);

    await service.updateDefinition('project-1', {
      detailedDescriptionHtml: '<script>alert(1)</script><p>Descricao</p>',
    });

    const saved = scopeDefinitionsRepository.save.mock.calls[0][0] as {
      detailedDescription: { html: string };
    };

    expect(saved.detailedDescription.html).not.toContain('<script>');
    expect(saved.detailedDescription.html).toContain('Descricao');
  });

  it('throws NotFoundException when updating a characteristic from another scope', async () => {
    const { service, sgsiScopesRepository, characteristicsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    characteristicsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.updateCharacteristic('project-1', 'other-scope-item', {
        description: 'x',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a benefit scoped to the project SgsiScope', async () => {
    const { service, sgsiScopesRepository, benefitsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);

    await service.createBenefit('project-1', {
      description: 'Reducao de risco',
    });

    expect(benefitsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        description: 'Reducao de risco',
      }),
    );
  });
});
