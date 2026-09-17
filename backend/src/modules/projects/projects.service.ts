import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { type RequestUser } from '../../common/decorators/current-user.decorator';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { MembershipRole } from '../../common/enums/membership-role.enum';
import { AuditLogEntity } from '../audit-log/entities/audit-log.entity';
import { OrganizationsAccessService } from '../organizations/organizations-access.service';
import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { type ProjectInputDto } from './dto/project-input.dto';
import { ProjectMemberEntity } from './entities/project-member.entity';
import { ProjectEntity } from './entities/project.entity';

export interface ProjectResponse extends ProjectEntity {
  participantUserIds: string[];
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectMemberEntity)
    private readonly projectMembersRepository: Repository<ProjectMemberEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogsRepository: Repository<AuditLogEntity>,
    private readonly organizationsAccessService: OrganizationsAccessService,
    private readonly usersService: UsersService,
  ) {}

  async findAllForUser(
    user: RequestUser,
    organizationId?: string,
  ): Promise<ProjectResponse[]> {
    const where = organizationId ? { organizationId } : {};

    let projects: ProjectEntity[];

    if ((user.role as UserRole) === UserRole.ADMIN) {
      projects = await this.projectsRepository.find({
        where,
        order: { createdAt: 'DESC' },
      });
    } else {
      const memberships = await this.projectMembersRepository.find({
        where: { userId: user.userId },
      });
      const projectIds = memberships.map((membership) => membership.projectId);

      if (projectIds.length === 0) {
        return [];
      }

      projects = await this.projectsRepository.find({
        where: { ...where, id: In(projectIds) },
        order: { createdAt: 'DESC' },
      });
    }

    return Promise.all(projects.map((project) => this.toResponse(project)));
  }

  async create(
    user: RequestUser,
    dto: ProjectInputDto,
  ): Promise<ProjectResponse> {
    await this.organizationsAccessService.assertOrganizationAccess(
      user,
      dto.organizationId,
    );
    await this.usersService.findOne(dto.responsibleUserId);

    const participantUserIds = await this.resolveParticipantUserIds(
      dto.participantUserIds,
    );

    const project = await this.projectsRepository.save(
      this.projectsRepository.create({
        name: dto.name,
        organizationId: dto.organizationId,
        description: dto.description ?? null,
        responsibleUserId: dto.responsibleUserId,
        startDate: dto.startDate ?? null,
        expectedEndDate: dto.expectedEndDate ?? null,
        status: dto.status,
      }),
    );

    const memberUserIds = new Set([
      dto.responsibleUserId,
      user.userId,
      ...participantUserIds,
    ]);

    await this.projectMembersRepository.save(
      Array.from(memberUserIds, (userId) =>
        this.projectMembersRepository.create({
          projectId: project.id,
          userId,
          role: MembershipRole.CONSULTANT,
        }),
      ),
    );

    return this.toResponse(project);
  }

  async findOne(id: string): Promise<ProjectResponse> {
    const project = await this.findOneEntity(id);

    return this.toResponse(project);
  }

  async update(
    id: string,
    user: RequestUser,
    dto: ProjectInputDto,
  ): Promise<ProjectResponse> {
    const project = await this.findOneEntity(id);

    if (dto.organizationId !== project.organizationId) {
      await this.organizationsAccessService.assertOrganizationAccess(
        user,
        dto.organizationId,
      );
    }

    if (dto.responsibleUserId !== project.responsibleUserId) {
      await this.usersService.findOne(dto.responsibleUserId);
    }

    const previousStatus = project.status;
    const participantUserIds = await this.resolveParticipantUserIds(
      dto.participantUserIds,
    );

    project.name = dto.name;
    project.organizationId = dto.organizationId;
    project.description = dto.description ?? null;
    project.responsibleUserId = dto.responsibleUserId;
    project.startDate = dto.startDate ?? null;
    project.expectedEndDate = dto.expectedEndDate ?? null;

    if (dto.status) {
      project.status = dto.status;
    }

    const savedProject = await this.projectsRepository.save(project);

    await this.addMissingMembers(savedProject.id, [
      dto.responsibleUserId,
      ...participantUserIds,
    ]);

    if (dto.status && dto.status !== previousStatus) {
      await this.auditLogsRepository.save(
        this.auditLogsRepository.create({
          organizationId: savedProject.organizationId,
          projectId: savedProject.id,
          userId: user.userId,
          entity: 'Project',
          entityId: savedProject.id,
          action: AuditAction.STATUS_CHANGE,
          metadata: { from: previousStatus, to: dto.status },
        }),
      );
    }

    return this.toResponse(savedProject);
  }

  async remove(id: string): Promise<void> {
    await this.findOneEntity(id);

    await this.projectsRepository.softDelete(id);
  }

  private async findOneEntity(id: string): Promise<ProjectEntity> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    return project;
  }

  private async resolveParticipantUserIds(
    participantUserIds: string[] | undefined,
  ): Promise<string[]> {
    if (!participantUserIds || participantUserIds.length === 0) {
      return [];
    }

    const uniqueIds = Array.from(new Set(participantUserIds));

    await Promise.all(
      uniqueIds.map((userId) => this.usersService.findOne(userId)),
    );

    return uniqueIds;
  }

  private async addMissingMembers(
    projectId: string,
    userIds: string[],
  ): Promise<void> {
    const uniqueIds = Array.from(new Set(userIds));

    if (uniqueIds.length === 0) {
      return;
    }

    const existingMemberships = await this.projectMembersRepository.find({
      where: { projectId, userId: In(uniqueIds) },
    });
    const existingUserIds = new Set(
      existingMemberships.map((membership) => membership.userId),
    );
    const missingUserIds = uniqueIds.filter(
      (userId) => !existingUserIds.has(userId),
    );

    if (missingUserIds.length === 0) {
      return;
    }

    await this.projectMembersRepository.save(
      missingUserIds.map((userId) =>
        this.projectMembersRepository.create({
          projectId,
          userId,
          role: MembershipRole.CONSULTANT,
        }),
      ),
    );
  }

  private async toResponse(project: ProjectEntity): Promise<ProjectResponse> {
    const memberships = await this.projectMembersRepository.find({
      where: { projectId: project.id },
    });
    const participantUserIds = memberships
      .map((membership) => membership.userId)
      .filter((userId) => userId !== project.responsibleUserId);

    return { ...project, participantUserIds };
  }
}
