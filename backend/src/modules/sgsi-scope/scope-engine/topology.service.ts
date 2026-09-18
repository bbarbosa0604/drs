import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import {
  type CreateTopologyLinkDto,
  type UpdateTopologyLinkDto,
} from './dto/topology-link.dto';
import {
  type CreateTopologyNodeDto,
  type UpdateTopologyNodeDto,
} from './dto/topology-node.dto';
import { TopologyLinkEntity } from './entities/topology-link.entity';
import { TopologyNodeEntity } from './entities/topology-node.entity';

export interface TopologySectionResponse {
  nodes: TopologyNodeEntity[];
  links: TopologyLinkEntity[];
}

/** Etapa 6.1 - Topologia (PRD secao 13.1). Persistencia; render fica na Task 019. */
@Injectable()
export class TopologyService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(TopologyNodeEntity)
    private readonly nodesRepository: Repository<TopologyNodeEntity>,
    @InjectRepository(TopologyLinkEntity)
    private readonly linksRepository: Repository<TopologyLinkEntity>,
  ) {}

  async getSection(projectId: string): Promise<TopologySectionResponse> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    const [nodes, links] = await Promise.all([
      this.nodesRepository.find({
        where: { sgsiScopeId },
        order: { createdAt: 'ASC' },
      }),
      this.linksRepository.find({
        where: { sgsiScopeId },
        order: { createdAt: 'ASC' },
      }),
    ]);

    return { nodes, links };
  }

  async createNode(
    projectId: string,
    dto: CreateTopologyNodeDto,
  ): Promise<TopologyNodeEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.nodesRepository.save(
      this.nodesRepository.create({
        sgsiScopeId,
        name: dto.name,
        type: dto.type,
        description: dto.description ?? null,
        classification: dto.classification ?? null,
      }),
    );
  }

  async updateNode(
    projectId: string,
    nodeId: string,
    dto: UpdateTopologyNodeDto,
  ): Promise<TopologyNodeEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const node = await this.nodesRepository.findOne({
      where: { id: nodeId, sgsiScopeId },
    });

    if (!node) {
      throw new NotFoundException('Topology node not found.');
    }

    Object.assign(node, dto);

    return this.nodesRepository.save(node);
  }

  async removeNode(projectId: string, nodeId: string): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const node = await this.nodesRepository.findOne({
      where: { id: nodeId, sgsiScopeId },
    });

    if (!node) {
      throw new NotFoundException('Topology node not found.');
    }

    const referencingLinksCount = await this.linksRepository.count({
      where: [{ fromNodeId: nodeId }, { toNodeId: nodeId }],
    });

    if (referencingLinksCount > 0) {
      throw new ConflictException(
        'This node is referenced by one or more topology links and cannot be removed. Remove the links first.',
      );
    }

    await this.nodesRepository.remove(node);
  }

  async createLink(
    projectId: string,
    dto: CreateTopologyLinkDto,
  ): Promise<TopologyLinkEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    await this.findNodeOrFail(sgsiScopeId, dto.fromNodeId);
    await this.findNodeOrFail(sgsiScopeId, dto.toNodeId);

    return this.linksRepository.save(
      this.linksRepository.create({
        sgsiScopeId,
        fromNodeId: dto.fromNodeId,
        toNodeId: dto.toNodeId,
        description: dto.description ?? null,
        linkType: dto.linkType ?? null,
      }),
    );
  }

  async updateLink(
    projectId: string,
    linkId: string,
    dto: UpdateTopologyLinkDto,
  ): Promise<TopologyLinkEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const link = await this.linksRepository.findOne({
      where: { id: linkId, sgsiScopeId },
    });

    if (!link) {
      throw new NotFoundException('Topology link not found.');
    }

    if (dto.fromNodeId !== undefined) {
      await this.findNodeOrFail(sgsiScopeId, dto.fromNodeId);
      link.fromNodeId = dto.fromNodeId;
    }
    if (dto.toNodeId !== undefined) {
      await this.findNodeOrFail(sgsiScopeId, dto.toNodeId);
      link.toNodeId = dto.toNodeId;
    }
    if (dto.description !== undefined) {
      link.description = dto.description;
    }
    if (dto.linkType !== undefined) {
      link.linkType = dto.linkType;
    }

    return this.linksRepository.save(link);
  }

  async removeLink(projectId: string, linkId: string): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const link = await this.linksRepository.findOne({
      where: { id: linkId, sgsiScopeId },
    });

    if (!link) {
      throw new NotFoundException('Topology link not found.');
    }

    await this.linksRepository.remove(link);
  }

  private async findNodeOrFail(
    sgsiScopeId: string,
    nodeId: string,
  ): Promise<TopologyNodeEntity> {
    const node = await this.nodesRepository.findOne({
      where: { id: nodeId, sgsiScopeId },
    });

    if (!node) {
      throw new BadRequestException(`Topology node "${nodeId}" not found.`);
    }

    return node;
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
