import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import {
  type CreateValueChainBlockDto,
  type UpdateValueChainBlockDto,
} from './dto/value-chain-block.dto';
import { ValueChainBlockEntity } from './entities/value-chain-block.entity';

export interface ValueChainSectionResponse {
  blocks: ValueChainBlockEntity[];
}

/** Etapa 5 - Cadeia de Valor (PRD secao 12). Persistencia; render fica na Task 019. */
@Injectable()
export class ValueChainService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(ValueChainBlockEntity)
    private readonly blocksRepository: Repository<ValueChainBlockEntity>,
  ) {}

  async getSection(projectId: string): Promise<ValueChainSectionResponse> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    const blocks = await this.blocksRepository.find({
      where: { sgsiScopeId },
      order: { createdAt: 'ASC' },
    });

    return { blocks };
  }

  async createBlock(
    projectId: string,
    dto: CreateValueChainBlockDto,
  ): Promise<ValueChainBlockEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.blocksRepository.save(
      this.blocksRepository.create({
        sgsiScopeId,
        name: dto.name,
        description: dto.description ?? null,
        responsibleArea: dto.responsibleArea ?? null,
        category: dto.category,
        classification: dto.classification ?? null,
      }),
    );
  }

  async updateBlock(
    projectId: string,
    blockId: string,
    dto: UpdateValueChainBlockDto,
  ): Promise<ValueChainBlockEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const block = await this.blocksRepository.findOne({
      where: { id: blockId, sgsiScopeId },
    });

    if (!block) {
      throw new NotFoundException('Value chain block not found.');
    }

    Object.assign(block, dto);

    return this.blocksRepository.save(block);
  }

  async removeBlock(projectId: string, blockId: string): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const block = await this.blocksRepository.findOne({
      where: { id: blockId, sgsiScopeId },
    });

    if (!block) {
      throw new NotFoundException('Value chain block not found.');
    }

    await this.blocksRepository.remove(block);
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
