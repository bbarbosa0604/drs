import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import {
  type CreateProjectRequirementDto,
  type UpdateProjectRequirementDto,
} from './dto/project-requirement.dto';
import { ProjectRequirementEntity } from './entities/project-requirement.entity';
import { RequirementEntity } from './entities/requirement.entity';

export interface ProjectRequirementsResponse {
  library: RequirementEntity[];
  selected: ProjectRequirementEntity[];
}

/**
 * "listar requisitos -> retorna a biblioteca seed + requisitos customizados
 * do projeto" (Task 015). A biblioteca vem inteira (e pequena, curada pelo
 * DSR Admin); `selected` sao os requisitos que este projeto de fato aplicou
 * (da biblioteca ou customizados).
 */
@Injectable()
export class ProjectRequirementsService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(RequirementEntity)
    private readonly requirementsRepository: Repository<RequirementEntity>,
    @InjectRepository(ProjectRequirementEntity)
    private readonly projectRequirementsRepository: Repository<ProjectRequirementEntity>,
  ) {}

  async list(projectId: string): Promise<ProjectRequirementsResponse> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    const [library, selected] = await Promise.all([
      this.requirementsRepository.find({ order: { title: 'ASC' } }),
      this.projectRequirementsRepository.find({
        where: { sgsiScopeId },
        order: { createdAt: 'ASC' },
      }),
    ]);

    return { library, selected };
  }

  async create(
    projectId: string,
    dto: CreateProjectRequirementDto,
  ): Promise<ProjectRequirementEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    if (!dto.requirementId && !dto.title) {
      throw new BadRequestException(
        'Either requirementId or title must be provided.',
      );
    }

    let title = dto.title;
    let category = dto.category;
    let description = dto.description;

    if (dto.requirementId) {
      const requirement = await this.requirementsRepository.findOne({
        where: { id: dto.requirementId },
      });

      if (!requirement) {
        throw new NotFoundException('Requirement not found in the library.');
      }

      title = title ?? requirement.title;
      category = category ?? requirement.category;
      description = description ?? requirement.description;
    }

    return this.projectRequirementsRepository.save(
      this.projectRequirementsRepository.create({
        sgsiScopeId,
        requirementId: dto.requirementId ?? null,
        title: title!,
        category,
        description: description ?? null,
        observations: dto.observations ?? null,
      }),
    );
  }

  async update(
    projectId: string,
    projectRequirementId: string,
    dto: UpdateProjectRequirementDto,
  ): Promise<ProjectRequirementEntity> {
    const projectRequirement = await this.findOne(
      projectId,
      projectRequirementId,
    );

    Object.assign(projectRequirement, dto);

    return this.projectRequirementsRepository.save(projectRequirement);
  }

  async remove(projectId: string, projectRequirementId: string): Promise<void> {
    const projectRequirement = await this.findOne(
      projectId,
      projectRequirementId,
    );

    await this.projectRequirementsRepository.remove(projectRequirement);
  }

  private async findOne(
    projectId: string,
    projectRequirementId: string,
  ): Promise<ProjectRequirementEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const projectRequirement = await this.projectRequirementsRepository.findOne(
      { where: { id: projectRequirementId, sgsiScopeId } },
    );

    if (!projectRequirement) {
      throw new NotFoundException('Project requirement not found.');
    }

    return projectRequirement;
  }

  private async resolveSgsiScopeId(projectId: string): Promise<string> {
    const sgsiScope = await this.sgsiScopesRepository.findOne({
      where: { projectId },
    });

    if (!sgsiScope) {
      throw new NotFoundException(
        'SGSI Scope module has not been activated for this project.',
      );
    }

    return sgsiScope.id;
  }
}
