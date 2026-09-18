import { BadRequestException, ConflictException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { type ArchitectureComponentEntity } from './entities/architecture-component.entity';
import { type ArchitectureInterfaceEntity } from './entities/architecture-interface.entity';
import { ArchitectureService } from './architecture.service';

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    count: jest.fn<Promise<number>, [unknown?]>(),
    create: jest.fn((input: Partial<T>) => input as T),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
    remove: jest.fn((entity: unknown) => Promise.resolve(entity)),
  };
}

function buildService() {
  const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
  const componentsRepository =
    buildRepositoryMock<ArchitectureComponentEntity>();
  const interfacesRepository =
    buildRepositoryMock<ArchitectureInterfaceEntity>();

  const service = new ArchitectureService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    componentsRepository as unknown as Repository<ArchitectureComponentEntity>,
    interfacesRepository as unknown as Repository<ArchitectureInterfaceEntity>,
  );

  return {
    service,
    sgsiScopesRepository,
    componentsRepository,
    interfacesRepository,
  };
}

describe('ArchitectureService', () => {
  it('creates a component scoped to the project SgsiScope, without forcing a classification', async () => {
    const { service, sgsiScopesRepository, componentsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);

    await service.createComponent('project-1', { name: 'API Gateway' });

    expect(componentsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        name: 'API Gateway',
        classification: null,
      }),
    );
  });

  it('rejects an interface pointing to a component that does not exist (400, PRD - casos de erro)', async () => {
    const { service, sgsiScopesRepository, componentsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    componentsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.createInterface('project-1', {
        fromComponentId: 'component-1',
        toComponentId: 'nao-existe',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('blocks removing a component still referenced by an interface (409, PRD - casos de erro)', async () => {
    const {
      service,
      sgsiScopesRepository,
      componentsRepository,
      interfacesRepository,
    } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    componentsRepository.findOne.mockResolvedValue({
      id: 'component-1',
      sgsiScopeId: 'sgsi-scope-1',
    } as ArchitectureComponentEntity);
    interfacesRepository.count.mockResolvedValue(1);

    await expect(
      service.removeComponent('project-1', 'component-1'),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(componentsRepository.remove).not.toHaveBeenCalled();
  });
});
