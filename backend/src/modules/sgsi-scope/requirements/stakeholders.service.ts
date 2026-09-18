import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import {
  type CreateStakeholderDto,
  type UpdateStakeholderDto,
} from './dto/stakeholder.dto';
import { StakeholderEntity } from './entities/stakeholder.entity';

@Injectable()
export class StakeholdersService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(StakeholderEntity)
    private readonly stakeholdersRepository: Repository<StakeholderEntity>,
  ) {}

  async list(projectId: string): Promise<StakeholderEntity[]> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.stakeholdersRepository.find({
      where: { sgsiScopeId },
      order: { createdAt: 'ASC' },
    });
  }

  async create(
    projectId: string,
    dto: CreateStakeholderDto,
  ): Promise<StakeholderEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.stakeholdersRepository.save(
      this.stakeholdersRepository.create({ ...dto, sgsiScopeId }),
    );
  }

  async update(
    projectId: string,
    stakeholderId: string,
    dto: UpdateStakeholderDto,
  ): Promise<StakeholderEntity> {
    const stakeholder = await this.findOne(projectId, stakeholderId);

    Object.assign(stakeholder, dto);

    return this.stakeholdersRepository.save(stakeholder);
  }

  async remove(projectId: string, stakeholderId: string): Promise<void> {
    const stakeholder = await this.findOne(projectId, stakeholderId);

    await this.stakeholdersRepository.remove(stakeholder);
  }

  private async findOne(
    projectId: string,
    stakeholderId: string,
  ): Promise<StakeholderEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const stakeholder = await this.stakeholdersRepository.findOne({
      where: { id: stakeholderId, sgsiScopeId },
    });

    if (!stakeholder) {
      throw new NotFoundException('Stakeholder not found.');
    }

    return stakeholder;
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
