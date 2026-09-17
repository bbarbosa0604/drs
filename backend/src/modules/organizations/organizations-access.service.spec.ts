import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { UserRole } from '../users/entities/user.entity';
import { type OrganizationMemberEntity } from './entities/organization-member.entity';
import { type OrganizationEntity } from './entities/organization.entity';
import { OrganizationsAccessService } from './organizations-access.service';

function buildRepositoryMock<T extends object>() {
  return {
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
  };
}

function buildService(
  organizationsRepository: ReturnType<
    typeof buildRepositoryMock<OrganizationEntity>
  >,
  organizationMembersRepository: ReturnType<
    typeof buildRepositoryMock<OrganizationMemberEntity>
  >,
) {
  return new OrganizationsAccessService(
    organizationsRepository as unknown as Repository<OrganizationEntity>,
    organizationMembersRepository as unknown as Repository<OrganizationMemberEntity>,
  );
}

describe('OrganizationsAccessService', () => {
  it('throws NotFoundException when the organization does not exist', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    organizationsRepository.findOne.mockResolvedValue(null);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
    );

    await expect(
      service.assertOrganizationAccess(
        {
          userId: 'user-a',
          email: 'a@a.com',
          role: UserRole.MEMBER,
          name: 'A',
        },
        'org-missing',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(organizationMembersRepository.findOne).not.toHaveBeenCalled();
  });

  it('blocks a consultant from Organization A accessing Organization B (IDOR)', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    organizationsRepository.findOne.mockResolvedValue({
      id: 'org-b',
    } as OrganizationEntity);
    organizationMembersRepository.findOne.mockResolvedValue(null);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
    );

    await expect(
      service.assertOrganizationAccess(
        {
          userId: 'consultant-of-org-a',
          email: 'consultant@a.com',
          role: UserRole.MEMBER,
          name: 'Consultant',
        },
        'org-b',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(organizationMembersRepository.findOne).toHaveBeenCalledWith({
      where: { organizationId: 'org-b', userId: 'consultant-of-org-a' },
    });
  });

  it('allows a consultant with a membership in the requested organization', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    organizationsRepository.findOne.mockResolvedValue({
      id: 'org-a',
    } as OrganizationEntity);
    organizationMembersRepository.findOne.mockResolvedValue({
      id: 'membership-1',
    } as OrganizationMemberEntity);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
    );

    await expect(
      service.assertOrganizationAccess(
        {
          userId: 'consultant-of-org-a',
          email: 'consultant@a.com',
          role: UserRole.MEMBER,
          name: 'Consultant',
        },
        'org-a',
      ),
    ).resolves.toBeUndefined();
  });

  it('allows a DSR Admin to access any organization without a membership row', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    organizationsRepository.findOne.mockResolvedValue({
      id: 'org-any',
    } as OrganizationEntity);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
    );

    await expect(
      service.assertOrganizationAccess(
        {
          userId: 'admin-1',
          email: 'admin@dsr.com',
          role: UserRole.ADMIN,
          name: 'Admin',
        },
        'org-any',
      ),
    ).resolves.toBeUndefined();
    expect(organizationMembersRepository.findOne).not.toHaveBeenCalled();
  });
});
