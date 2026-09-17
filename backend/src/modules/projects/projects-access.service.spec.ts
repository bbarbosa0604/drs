import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { UserRole } from '../users/entities/user.entity';
import { type ProjectMemberEntity } from './entities/project-member.entity';
import { type ProjectEntity } from './entities/project.entity';
import { ProjectsAccessService } from './projects-access.service';

function buildRepositoryMock<T extends object>() {
  return {
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
  };
}

function buildService(
  projectsRepository: ReturnType<typeof buildRepositoryMock<ProjectEntity>>,
  projectMembersRepository: ReturnType<
    typeof buildRepositoryMock<ProjectMemberEntity>
  >,
) {
  return new ProjectsAccessService(
    projectsRepository as unknown as Repository<ProjectEntity>,
    projectMembersRepository as unknown as Repository<ProjectMemberEntity>,
  );
}

describe('ProjectsAccessService', () => {
  it('throws NotFoundException when the project does not exist', async () => {
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    const projectMembersRepository = buildRepositoryMock<ProjectMemberEntity>();
    projectsRepository.findOne.mockResolvedValue(null);

    const service = buildService(projectsRepository, projectMembersRepository);

    await expect(
      service.assertProjectAccess(
        {
          userId: 'user-a',
          email: 'a@a.com',
          role: UserRole.MEMBER,
          name: 'A',
        },
        'project-missing',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(projectMembersRepository.findOne).not.toHaveBeenCalled();
  });

  it('blocks a consultant of Project A from accessing Project B (IDOR)', async () => {
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    const projectMembersRepository = buildRepositoryMock<ProjectMemberEntity>();
    projectsRepository.findOne.mockResolvedValue({
      id: 'project-b',
    } as ProjectEntity);
    projectMembersRepository.findOne.mockResolvedValue(null);

    const service = buildService(projectsRepository, projectMembersRepository);

    await expect(
      service.assertProjectAccess(
        {
          userId: 'consultant-of-project-a',
          email: 'consultant@a.com',
          role: UserRole.MEMBER,
          name: 'Consultant',
        },
        'project-b',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(projectMembersRepository.findOne).toHaveBeenCalledWith({
      where: { projectId: 'project-b', userId: 'consultant-of-project-a' },
    });
  });

  it('allows a consultant with a membership in the requested project', async () => {
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    const projectMembersRepository = buildRepositoryMock<ProjectMemberEntity>();
    projectsRepository.findOne.mockResolvedValue({
      id: 'project-a',
    } as ProjectEntity);
    projectMembersRepository.findOne.mockResolvedValue({
      id: 'membership-1',
    } as ProjectMemberEntity);

    const service = buildService(projectsRepository, projectMembersRepository);

    await expect(
      service.assertProjectAccess(
        {
          userId: 'consultant-of-project-a',
          email: 'consultant@a.com',
          role: UserRole.MEMBER,
          name: 'Consultant',
        },
        'project-a',
      ),
    ).resolves.toBeUndefined();
  });

  it('allows a DSR Admin to access any project without a membership row', async () => {
    const projectsRepository = buildRepositoryMock<ProjectEntity>();
    const projectMembersRepository = buildRepositoryMock<ProjectMemberEntity>();
    projectsRepository.findOne.mockResolvedValue({
      id: 'project-any',
    } as ProjectEntity);

    const service = buildService(projectsRepository, projectMembersRepository);

    await expect(
      service.assertProjectAccess(
        {
          userId: 'admin-1',
          email: 'admin@dsr.com',
          role: UserRole.ADMIN,
          name: 'Admin',
        },
        'project-any',
      ),
    ).resolves.toBeUndefined();
    expect(projectMembersRepository.findOne).not.toHaveBeenCalled();
  });
});
