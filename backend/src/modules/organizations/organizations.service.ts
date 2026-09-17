import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { type RequestUser } from '../../common/decorators/current-user.decorator';
import { MembershipRole } from '../../common/enums/membership-role.enum';
import { ProjectEntity } from '../projects/entities/project.entity';
import { UserRole } from '../users/entities/user.entity';
import { type OrganizationInputDto } from './dto/organization-input.dto';
import { OrganizationMemberEntity } from './entities/organization-member.entity';
import { OrganizationEntity } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationsRepository: Repository<OrganizationEntity>,
    @InjectRepository(OrganizationMemberEntity)
    private readonly organizationMembersRepository: Repository<OrganizationMemberEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
  ) {}

  async findAllForUser(user: RequestUser): Promise<OrganizationEntity[]> {
    if ((user.role as UserRole) === UserRole.ADMIN) {
      return this.organizationsRepository.find({
        order: { createdAt: 'DESC' },
      });
    }

    const memberships = await this.organizationMembersRepository.find({
      where: { userId: user.userId },
    });
    const organizationIds = memberships.map(
      (membership) => membership.organizationId,
    );

    if (organizationIds.length === 0) {
      return [];
    }

    return this.organizationsRepository.find({
      where: { id: In(organizationIds) },
      order: { createdAt: 'DESC' },
    });
  }

  async create(
    user: RequestUser,
    dto: OrganizationInputDto,
  ): Promise<OrganizationEntity> {
    const organization = await this.organizationsRepository.save(
      this.organizationsRepository.create(dto),
    );

    await this.organizationMembersRepository.save(
      this.organizationMembersRepository.create({
        organizationId: organization.id,
        userId: user.userId,
        role: MembershipRole.CONSULTANT,
      }),
    );

    return organization;
  }

  async findOne(id: string): Promise<OrganizationEntity> {
    const organization = await this.organizationsRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    return organization;
  }

  async update(
    id: string,
    dto: OrganizationInputDto,
  ): Promise<OrganizationEntity> {
    const organization = await this.findOne(id);

    Object.assign(organization, dto);

    return this.organizationsRepository.save(organization);
  }

  /**
   * Politica adotada (pendente de confirmacao humana, ver task 005): bloqueia
   * a exclusao enquanto existir qualquer projeto nao deletado vinculado a
   * organizacao, em vez de cascatear o soft delete.
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id);

    const activeProjectsCount = await this.projectsRepository.count({
      where: { organizationId: id },
    });

    if (activeProjectsCount > 0) {
      throw new ConflictException(
        'Cannot delete an organization that still has projects. Archive or remove its projects first.',
      );
    }

    await this.organizationsRepository.softDelete(id);
  }
}
