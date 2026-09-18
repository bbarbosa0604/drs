import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { sanitizeRichTextHtml } from '../../../common/utils/sanitize-rich-text.util';
import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import {
  type CreateScopeListItemDto,
  type UpdateScopeListItemDto,
} from './dto/scope-list-item.dto';
import { type UpdateScopeDefinitionDto } from './dto/update-scope-definition.dto';
import { ScopeBenefitEntity } from './entities/scope-benefit.entity';
import { ScopeCharacteristicEntity } from './entities/scope-characteristic.entity';
import { ScopeDefinitionEntity } from './entities/scope-definition.entity';

export interface ScopeDefinitionSectionResponse {
  scopeDefinition: ScopeDefinitionEntity | null;
  characteristics: ScopeCharacteristicEntity[];
  benefits: ScopeBenefitEntity[];
}

@Injectable()
export class ScopeDefinitionService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(ScopeDefinitionEntity)
    private readonly scopeDefinitionsRepository: Repository<ScopeDefinitionEntity>,
    @InjectRepository(ScopeCharacteristicEntity)
    private readonly characteristicsRepository: Repository<ScopeCharacteristicEntity>,
    @InjectRepository(ScopeBenefitEntity)
    private readonly benefitsRepository: Repository<ScopeBenefitEntity>,
  ) {}

  async getSection(projectId: string): Promise<ScopeDefinitionSectionResponse> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    const [scopeDefinition, characteristics, benefits] = await Promise.all([
      this.scopeDefinitionsRepository.findOne({ where: { sgsiScopeId } }),
      this.characteristicsRepository.find({
        where: { sgsiScopeId },
        order: { createdAt: 'ASC' },
      }),
      this.benefitsRepository.find({
        where: { sgsiScopeId },
        order: { createdAt: 'ASC' },
      }),
    ]);

    return {
      scopeDefinition: scopeDefinition ?? null,
      characteristics,
      benefits,
    };
  }

  async updateDefinition(
    projectId: string,
    dto: UpdateScopeDefinitionDto,
  ): Promise<ScopeDefinitionEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const existing = await this.scopeDefinitionsRepository.findOne({
      where: { sgsiScopeId },
    });

    const detailedDescription =
      dto.detailedDescriptionHtml === undefined
        ? (existing?.detailedDescription ?? null)
        : dto.detailedDescriptionHtml === null
          ? null
          : { html: sanitizeRichTextHtml(dto.detailedDescriptionHtml) };

    if (existing) {
      if (dto.formalDeclaration !== undefined) {
        existing.formalDeclaration = dto.formalDeclaration;
      }
      if (dto.executiveJustification !== undefined) {
        existing.executiveJustification = dto.executiveJustification;
      }
      existing.detailedDescription = detailedDescription;

      return this.scopeDefinitionsRepository.save(existing);
    }

    return this.scopeDefinitionsRepository.save(
      this.scopeDefinitionsRepository.create({
        sgsiScopeId,
        formalDeclaration: dto.formalDeclaration ?? null,
        executiveJustification: dto.executiveJustification ?? null,
        detailedDescription,
      }),
    );
  }

  async createCharacteristic(
    projectId: string,
    dto: CreateScopeListItemDto,
  ): Promise<ScopeCharacteristicEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.characteristicsRepository.save(
      this.characteristicsRepository.create({ ...dto, sgsiScopeId }),
    );
  }

  async updateCharacteristic(
    projectId: string,
    characteristicId: string,
    dto: UpdateScopeListItemDto,
  ): Promise<ScopeCharacteristicEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const characteristic = await this.characteristicsRepository.findOne({
      where: { id: characteristicId, sgsiScopeId },
    });

    if (!characteristic) {
      throw new NotFoundException('Scope characteristic not found.');
    }

    Object.assign(characteristic, dto);

    return this.characteristicsRepository.save(characteristic);
  }

  async removeCharacteristic(
    projectId: string,
    characteristicId: string,
  ): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const characteristic = await this.characteristicsRepository.findOne({
      where: { id: characteristicId, sgsiScopeId },
    });

    if (!characteristic) {
      throw new NotFoundException('Scope characteristic not found.');
    }

    await this.characteristicsRepository.remove(characteristic);
  }

  async createBenefit(
    projectId: string,
    dto: CreateScopeListItemDto,
  ): Promise<ScopeBenefitEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.benefitsRepository.save(
      this.benefitsRepository.create({ ...dto, sgsiScopeId }),
    );
  }

  async updateBenefit(
    projectId: string,
    benefitId: string,
    dto: UpdateScopeListItemDto,
  ): Promise<ScopeBenefitEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const benefit = await this.benefitsRepository.findOne({
      where: { id: benefitId, sgsiScopeId },
    });

    if (!benefit) {
      throw new NotFoundException('Scope benefit not found.');
    }

    Object.assign(benefit, dto);

    return this.benefitsRepository.save(benefit);
  }

  async removeBenefit(projectId: string, benefitId: string): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const benefit = await this.benefitsRepository.findOne({
      where: { id: benefitId, sgsiScopeId },
    });

    if (!benefit) {
      throw new NotFoundException('Scope benefit not found.');
    }

    await this.benefitsRepository.remove(benefit);
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
