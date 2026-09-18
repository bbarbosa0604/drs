import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { type GovernanceCommitteeEntity } from './entities/governance-committee.entity';
import { type GovernanceMemberEntity } from './entities/governance-member.entity';
import { GovernanceService } from './governance.service';

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
  const committeesRepository = buildRepositoryMock<GovernanceCommitteeEntity>();
  const membersRepository = buildRepositoryMock<GovernanceMemberEntity>();

  const service = new GovernanceService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    committeesRepository as unknown as Repository<GovernanceCommitteeEntity>,
    membersRepository as unknown as Repository<GovernanceMemberEntity>,
  );

  return {
    service,
    sgsiScopesRepository,
    committeesRepository,
    membersRepository,
  };
}

describe('GovernanceService', () => {
  it('returns an empty section when no committee exists yet', async () => {
    const { service, sgsiScopesRepository, committeesRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    committeesRepository.findOne.mockResolvedValue(null);

    const result = await service.getSection('project-1');

    expect(result).toEqual({ committee: null, members: [] });
  });

  it('creates the committee lazily when the first member is added', async () => {
    const {
      service,
      sgsiScopesRepository,
      committeesRepository,
      membersRepository,
    } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    committeesRepository.findOne.mockResolvedValue(null);
    committeesRepository.save.mockResolvedValue({
      id: 'committee-1',
      sgsiScopeId: 'sgsi-scope-1',
    } as GovernanceCommitteeEntity);

    await service.createMember('project-1', {
      name: 'Ana',
      jobRole: 'CISO',
    });

    expect(committeesRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ sgsiScopeId: 'sgsi-scope-1' }),
    );
    expect(membersRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        governanceCommitteeId: 'committee-1',
        name: 'Ana',
        jobRole: 'CISO',
      }),
    );
  });

  it('throws NotFoundException when removing a member without a committee', async () => {
    const { service, sgsiScopesRepository, committeesRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    committeesRepository.findOne.mockResolvedValue(null);

    await expect(
      service.removeMember('project-1', 'member-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
