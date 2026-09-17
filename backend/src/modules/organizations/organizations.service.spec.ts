import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { UserRole } from '../users/entities/user.entity';
import { MembershipRole } from '../../common/enums/membership-role.enum';
import { type ProjectEntity } from '../projects/entities/project.entity';
import { type OrganizationMemberEntity } from './entities/organization-member.entity';
import { type OrganizationEntity } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    create: jest.fn<T, [Partial<T>]>((input: Partial<T>) => input as T),
    save: jest.fn<Promise<T>, [T]>((entity: T) => Promise.resolve(entity)),
    softDelete: jest.fn<Promise<unknown>, [string]>(),
    count: jest.fn<Promise<number>, [unknown?]>(),
  };
}

function buildService(
  organizationsRepository: ReturnType<
    typeof buildRepositoryMock<OrganizationEntity>
  >,
  organizationMembersRepository: ReturnType<
    typeof buildRepositoryMock<OrganizationMemberEntity>
  >,
  projectsRepository: ReturnType<typeof buildRepositoryMock<ProjectEntity>>,
) {
  return new OrganizationsService(
    organizationsRepository as unknown as Repository<OrganizationEntity>,
    organizationMembersRepository as unknown as Repository<OrganizationMemberEntity>,
    projectsRepository as unknown as Repository<ProjectEntity>,
  );
}

describe('OrganizationsService', () => {
  it('lists every organization for a DSR Admin without checking membership', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    organizationsRepository.find.mockResolvedValue([
      { id: 'org-a' } as OrganizationEntity,
      { id: 'org-b' } as OrganizationEntity,
    ]);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
      projectsRepository,
    );
    const result = await service.findAllForUser({
      userId: 'admin-1',
      email: 'admin@dsr.com',
      role: UserRole.ADMIN,
      name: 'Admin',
    });

    expect(result).toHaveLength(2);
    expect(organizationMembersRepository.find).not.toHaveBeenCalled();
  });

  it('lists only the organizations a consultant is a member of', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    organizationMembersRepository.find.mockResolvedValue([
      { organizationId: 'org-a' } as OrganizationMemberEntity,
    ]);
    organizationsRepository.find.mockResolvedValue([
      { id: 'org-a' } as OrganizationEntity,
    ]);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
      projectsRepository,
    );
    const result = await service.findAllForUser({
      userId: 'consultant-1',
      email: 'consultant@a.com',
      role: UserRole.MEMBER,
      name: 'Consultant',
    });

    expect(result).toEqual([{ id: 'org-a' }]);
  });

  it('returns an empty list for a consultant with no organization membership', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    organizationMembersRepository.find.mockResolvedValue([]);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
      projectsRepository,
    );
    const result = await service.findAllForUser({
      userId: 'consultant-1',
      email: 'consultant@a.com',
      role: UserRole.MEMBER,
      name: 'Consultant',
    });

    expect(result).toEqual([]);
    expect(organizationsRepository.find).not.toHaveBeenCalled();
  });

  it('creates the organization and enrolls the creator as a member', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    organizationsRepository.save.mockResolvedValue({
      id: 'org-new',
      name: 'Acme',
    } as OrganizationEntity);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
      projectsRepository,
    );
    const user = {
      userId: 'consultant-1',
      email: 'consultant@a.com',
      role: UserRole.MEMBER,
      name: 'Consultant',
    };
    const organization = await service.create(user, { name: 'Acme' });

    expect(organization).toEqual({ id: 'org-new', name: 'Acme' });
    expect(organizationMembersRepository.save).toHaveBeenCalledWith({
      organizationId: 'org-new',
      userId: 'consultant-1',
      role: MembershipRole.CONSULTANT,
    });
  });

  it('throws NotFoundException when the organization does not exist', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    organizationsRepository.findOne.mockResolvedValue(null);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
      projectsRepository,
    );

    await expect(service.findOne('org-missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('blocks deletion while the organization still has projects', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    organizationsRepository.findOne.mockResolvedValue({
      id: 'org-a',
    } as OrganizationEntity);
    projectsRepository.count.mockResolvedValue(1);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
      projectsRepository,
    );

    await expect(service.remove('org-a')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(organizationsRepository.softDelete).not.toHaveBeenCalled();
  });

  it('soft deletes an organization without projects', async () => {
    const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
    const organizationMembersRepository =
      buildRepositoryMock<OrganizationMemberEntity>();
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    organizationsRepository.findOne.mockResolvedValue({
      id: 'org-a',
    } as OrganizationEntity);
    projectsRepository.count.mockResolvedValue(0);

    const service = buildService(
      organizationsRepository,
      organizationMembersRepository,
      projectsRepository,
    );

    await service.remove('org-a');

    expect(organizationsRepository.softDelete).toHaveBeenCalledWith('org-a');
  });
});
