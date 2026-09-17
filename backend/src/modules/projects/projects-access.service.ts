import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type RequestUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ProjectMemberEntity } from './entities/project-member.entity';
import { ProjectEntity } from './entities/project.entity';

/**
 * Mesmo padrao de OrganizationsAccessService: 404 quando o projeto nao
 * existe, 403 quando existe mas o usuario nao tem vinculo (ProjectMember).
 * Vinculo de organizacao nao substitui vinculo de projeto no MVP.
 */
@Injectable()
export class ProjectsAccessService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectMemberEntity)
    private readonly projectMembersRepository: Repository<ProjectMemberEntity>,
  ) {}

  async assertProjectAccess(
    user: RequestUser,
    projectId: string,
  ): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if ((user.role as UserRole) === UserRole.ADMIN) {
      return;
    }

    const membership = await this.projectMembersRepository.findOne({
      where: { projectId, userId: user.userId },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this project.');
    }
  }
}
