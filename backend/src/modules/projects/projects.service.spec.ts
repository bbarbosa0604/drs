import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { MembershipRole } from '../../common/enums/membership-role.enum';
import { ProjectStatus } from '../../common/enums/project-status.enum';
import { type AuditLogEntity } from '../audit-log/entities/audit-log.entity';
import { type OrganizationsAccessService } from '../organizations/organizations-access.service';
import { UserRole } from '../users/entities/user.entity';
import { type UsersService } from '../users/users.service';
import { type ProjectMemberEntity } from './entities/project-member.entity';
import { type ProjectEntity } from './entities/project.entity';
import { ProjectsService } from './projects.service';

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    create: jest.fn((input: Partial<T> | Partial<T>[]) => input as T),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
    softDelete: jest.fn<Promise<unknown>, [string]>(),
  };
}

function buildAccessServiceMock() {
  return {
    assertOrganizationAccess: jest.fn<Promise<void>, [unknown, string]>(),
  };
}

function buildUsersServiceMock() {
  return {
    findOne: jest.fn<Promise<unknown>, [string]>(),
  };
}

function buildService(
  projectsRepository: ReturnType<typeof buildRepositoryMock<ProjectEntity>>,
  projectMembersRepository: ReturnType<
    typeof buildRepositoryMock<ProjectMemberEntity>
  >,
  auditLogsRepository: ReturnType<typeof buildRepositoryMock<AuditLogEntity>>,
  organizationsAccessService: ReturnType<typeof buildAccessServiceMock>,
  usersService: ReturnType<typeof buildUsersServiceMock>,
) {
  return new ProjectsService(
    projectsRepository as unknown as Repository<ProjectEntity>,
    projectMembersRepository as unknown as Repository<ProjectMemberEntity>,
    auditLogsRepository as unknown as Repository<AuditLogEntity>,
    organizationsAccessService as unknown as OrganizationsAccessService,
    usersService as unknown as UsersService,
  );
}

const consultant = {
  userId: 'consultant-1',
  email: 'consultant@a.com',
  role: UserRole.MEMBER,
  name: 'Consultant',
};

describe('ProjectsService', () => {
  it('rejects creation when the user has no access to the organization (IDOR)', async () => {
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    const projectMembersRepository = buildRepositoryMock<ProjectMemberEntity>();
    const auditLogsRepository = buildRepositoryMock<AuditLogEntity>();
    const organizationsAccessService = buildAccessServiceMock();
    const usersService = buildUsersServiceMock();
    organizationsAccessService.assertOrganizationAccess.mockRejectedValue(
      new Error('forbidden'),
    );

    const service = buildService(
      projectsRepository,
      projectMembersRepository,
      auditLogsRepository,
      organizationsAccessService,
      usersService,
    );

    await expect(
      service.create(consultant, {
        name: 'Projeto X',
        organizationId: 'org-b',
        responsibleUserId: 'user-1',
      }),
    ).rejects.toThrow('forbidden');
    expect(projectsRepository.save).not.toHaveBeenCalled();
  });

  it('creates a project and enrolls responsible, creator and participants as members', async () => {
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    const projectMembersRepository = buildRepositoryMock<ProjectMemberEntity>();
    const auditLogsRepository = buildRepositoryMock<AuditLogEntity>();
    const organizationsAccessService = buildAccessServiceMock();
    const usersService = buildUsersServiceMock();
    organizationsAccessService.assertOrganizationAccess.mockResolvedValue(
      undefined,
    );
    usersService.findOne.mockResolvedValue({ id: 'some-user' });
    projectsRepository.save.mockResolvedValue({
      id: 'project-1',
      organizationId: 'org-a',
      responsibleUserId: 'responsible-1',
    } as ProjectEntity);
    projectMembersRepository.find.mockResolvedValue([
      { userId: 'responsible-1' } as ProjectMemberEntity,
      { userId: 'consultant-1' } as ProjectMemberEntity,
      { userId: 'participant-1' } as ProjectMemberEntity,
    ]);

    const service = buildService(
      projectsRepository,
      projectMembersRepository,
      auditLogsRepository,
      organizationsAccessService,
      usersService,
    );

    const result = await service.create(consultant, {
      name: 'Projeto X',
      organizationId: 'org-a',
      responsibleUserId: 'responsible-1',
      participantUserIds: ['participant-1'],
    });

    expect(projectMembersRepository.save).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          projectId: 'project-1',
          userId: 'responsible-1',
          role: MembershipRole.CONSULTANT,
        }),
        expect.objectContaining({
          projectId: 'project-1',
          userId: 'consultant-1',
        }),
        expect.objectContaining({
          projectId: 'project-1',
          userId: 'participant-1',
        }),
      ]),
    );
    expect(result.participantUserIds).toEqual([
      'consultant-1',
      'participant-1',
    ]);
  });

  it('throws NotFoundException when the project does not exist', async () => {
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    const projectMembersRepository = buildRepositoryMock<ProjectMemberEntity>();
    const auditLogsRepository = buildRepositoryMock<AuditLogEntity>();
    const organizationsAccessService = buildAccessServiceMock();
    const usersService = buildUsersServiceMock();
    projectsRepository.findOne.mockResolvedValue(null);

    const service = buildService(
      projectsRepository,
      projectMembersRepository,
      auditLogsRepository,
      organizationsAccessService,
      usersService,
    );

    await expect(service.findOne('project-missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('records an AuditLog STATUS_CHANGE entry when the status changes on update', async () => {
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    const projectMembersRepository = buildRepositoryMock<ProjectMemberEntity>();
    const auditLogsRepository = buildRepositoryMock<AuditLogEntity>();
    const organizationsAccessService = buildAccessServiceMock();
    const usersService = buildUsersServiceMock();
    const existingProject = {
      id: 'project-1',
      organizationId: 'org-a',
      responsibleUserId: 'responsible-1',
      status: ProjectStatus.DRAFT,
    } as ProjectEntity;
    projectsRepository.findOne.mockResolvedValue(existingProject);
    projectsRepository.save.mockImplementation((entity: unknown) =>
      Promise.resolve(entity),
    );
    projectMembersRepository.find.mockResolvedValue([]);

    const service = buildService(
      projectsRepository,
      projectMembersRepository,
      auditLogsRepository,
      organizationsAccessService,
      usersService,
    );

    await service.update('project-1', consultant, {
      name: 'Projeto X',
      organizationId: 'org-a',
      responsibleUserId: 'responsible-1',
      status: ProjectStatus.IN_PROGRESS,
    });

    expect(auditLogsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        action: AuditAction.STATUS_CHANGE,
        metadata: { from: ProjectStatus.DRAFT, to: ProjectStatus.IN_PROGRESS },
      }),
    );
  });

  it('does not record an AuditLog entry when the status is unchanged', async () => {
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    const projectMembersRepository = buildRepositoryMock<ProjectMemberEntity>();
    const auditLogsRepository = buildRepositoryMock<AuditLogEntity>();
    const organizationsAccessService = buildAccessServiceMock();
    const usersService = buildUsersServiceMock();
    const existingProject = {
      id: 'project-1',
      organizationId: 'org-a',
      responsibleUserId: 'responsible-1',
      status: ProjectStatus.DRAFT,
    } as ProjectEntity;
    projectsRepository.findOne.mockResolvedValue(existingProject);
    projectsRepository.save.mockImplementation((entity: unknown) =>
      Promise.resolve(entity),
    );
    projectMembersRepository.find.mockResolvedValue([]);

    const service = buildService(
      projectsRepository,
      projectMembersRepository,
      auditLogsRepository,
      organizationsAccessService,
      usersService,
    );

    await service.update('project-1', consultant, {
      name: 'Projeto X',
      organizationId: 'org-a',
      responsibleUserId: 'responsible-1',
      status: ProjectStatus.DRAFT,
    });

    expect(auditLogsRepository.save).not.toHaveBeenCalled();
  });
});
