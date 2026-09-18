import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { type StakeholderEntity } from './entities/stakeholder.entity';
import { StakeholdersService } from './stakeholders.service';

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    create: jest.fn((input: Partial<T>) => input as T),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
    remove: jest.fn((entity: unknown) => Promise.resolve(entity)),
  };
}

describe('StakeholdersService', () => {
  it('throws NotFoundException when the module has not been activated', async () => {
    const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
    const stakeholdersRepository = buildRepositoryMock<StakeholderEntity>();
    sgsiScopesRepository.findOne.mockResolvedValue(null);

    const service = new StakeholdersService(
      sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
      stakeholdersRepository as unknown as Repository<StakeholderEntity>,
    );

    await expect(service.list('project-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a stakeholder scoped to the project SgsiScope', async () => {
    const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
    const stakeholdersRepository = buildRepositoryMock<StakeholderEntity>();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);

    const service = new StakeholdersService(
      sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
      stakeholdersRepository as unknown as Repository<StakeholderEntity>,
    );

    await service.create('project-1', { name: 'Cliente principal' });

    expect(stakeholdersRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        name: 'Cliente principal',
      }),
    );
  });

  it('throws NotFoundException when removing a stakeholder from another scope', async () => {
    const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
    const stakeholdersRepository = buildRepositoryMock<StakeholderEntity>();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    stakeholdersRepository.findOne.mockResolvedValue(null);

    const service = new StakeholdersService(
      sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
      stakeholdersRepository as unknown as Repository<StakeholderEntity>,
    );

    await expect(
      service.remove('project-1', 'stakeholder-from-other-scope'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
