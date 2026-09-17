import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { sanitizeRichTextHtml } from '../../../common/utils/sanitize-rich-text.util';
import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { type CreateContextAspectDto } from './dto/create-context-aspect.dto';
import { type UpdateContextAspectDto } from './dto/update-context-aspect.dto';
import { type UpdateOrganizationContextDto } from './dto/update-organization-context.dto';
import { ContextAspectEntity } from './entities/context-aspect.entity';
import { OrganizationContextEntity } from './entities/organization-context.entity';

export interface ContextSectionResponse {
  organizationContext: OrganizationContextEntity | null;
  aspects: ContextAspectEntity[];
}

@Injectable()
export class ContextService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(OrganizationContextEntity)
    private readonly organizationContextsRepository: Repository<OrganizationContextEntity>,
    @InjectRepository(ContextAspectEntity)
    private readonly contextAspectsRepository: Repository<ContextAspectEntity>,
  ) {}

  async getSection(projectId: string): Promise<ContextSectionResponse> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    const [organizationContext, aspects] = await Promise.all([
      this.organizationContextsRepository.findOne({ where: { sgsiScopeId } }),
      this.contextAspectsRepository.find({
        where: { sgsiScopeId },
        order: { createdAt: 'ASC' },
      }),
    ]);

    return { organizationContext: organizationContext ?? null, aspects };
  }

  async updateHistory(
    projectId: string,
    dto: UpdateOrganizationContextDto,
  ): Promise<OrganizationContextEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const existing = await this.organizationContextsRepository.findOne({
      where: { sgsiScopeId },
    });

    const history =
      dto.historyHtml === undefined
        ? (existing?.history ?? null)
        : dto.historyHtml === null
          ? null
          : { html: sanitizeRichTextHtml(dto.historyHtml) };

    if (existing) {
      existing.history = history;

      return this.organizationContextsRepository.save(existing);
    }

    return this.organizationContextsRepository.save(
      this.organizationContextsRepository.create({ sgsiScopeId, history }),
    );
  }

  async createAspect(
    projectId: string,
    dto: CreateContextAspectDto,
  ): Promise<ContextAspectEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.contextAspectsRepository.save(
      this.contextAspectsRepository.create({ ...dto, sgsiScopeId }),
    );
  }

  async updateAspect(
    projectId: string,
    aspectId: string,
    dto: UpdateContextAspectDto,
  ): Promise<ContextAspectEntity> {
    const aspect = await this.findAspect(projectId, aspectId);

    Object.assign(aspect, dto);

    return this.contextAspectsRepository.save(aspect);
  }

  async removeAspect(projectId: string, aspectId: string): Promise<void> {
    const aspect = await this.findAspect(projectId, aspectId);

    await this.contextAspectsRepository.remove(aspect);
  }

  private async findAspect(
    projectId: string,
    aspectId: string,
  ): Promise<ContextAspectEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const aspect = await this.contextAspectsRepository.findOne({
      where: { id: aspectId, sgsiScopeId },
    });

    if (!aspect) {
      throw new NotFoundException('Context aspect not found.');
    }

    return aspect;
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
