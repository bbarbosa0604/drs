import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { ValueChainCategory } from '../../../common/enums/value-chain-category.enum';
import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { type ValueChainBlockEntity } from './entities/value-chain-block.entity';
import { ValueChainService } from './value-chain.service';

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
  const blocksRepository = buildRepositoryMock<ValueChainBlockEntity>();

  const service = new ValueChainService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    blocksRepository as unknown as Repository<ValueChainBlockEntity>,
  );

  return { service, sgsiScopesRepository, blocksRepository };
}

describe('ValueChainService', () => {
  it('creates a block scoped to the project SgsiScope, without forcing a classification', async () => {
    const { service, sgsiScopesRepository, blocksRepository } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);

    await service.createBlock('project-1', {
      name: 'Compras',
      category: ValueChainCategory.PRIMARY_PROCESS,
    });

    expect(blocksRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        name: 'Compras',
        category: ValueChainCategory.PRIMARY_PROCESS,
        classification: null,
      }),
    );
  });

  it('throws NotFoundException when the module has not been activated for the project', async () => {
    const { service, sgsiScopesRepository } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue(null);

    await expect(
      service.createBlock('project-1', {
        name: 'Compras',
        category: ValueChainCategory.PRIMARY_PROCESS,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws NotFoundException when updating a block from another scope', async () => {
    const { service, sgsiScopesRepository, blocksRepository } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    blocksRepository.findOne.mockResolvedValue(null);

    await expect(
      service.updateBlock('project-1', 'other-scope-block', { name: 'x' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
