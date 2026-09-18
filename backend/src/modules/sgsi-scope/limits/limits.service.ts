import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import {
  type CreateScopeAssetDto,
  type UpdateScopeAssetDto,
} from './dto/scope-asset.dto';
import {
  type CreateScopeEmployeeGroupDto,
  type UpdateScopeEmployeeGroupDto,
} from './dto/scope-employee-group.dto';
import {
  type CreateScopeLocationDto,
  type UpdateScopeLocationDto,
} from './dto/scope-location.dto';
import {
  type CreateScopeProviderDto,
  type UpdateScopeProviderDto,
} from './dto/scope-provider.dto';
import { type CreateScopeRevisionDto } from './dto/create-scope-revision.dto';
import { type UpdateScopeApprovalDto } from './dto/update-scope-approval.dto';
import { ScopeAssetEntity } from './entities/scope-asset.entity';
import { ScopeApprovalEntity } from './entities/scope-approval.entity';
import { ScopeEmployeeGroupEntity } from './entities/scope-employee-group.entity';
import { ScopeLocationEntity } from './entities/scope-location.entity';
import { ScopeProviderEntity } from './entities/scope-provider.entity';
import { ScopeRevisionEntity } from './entities/scope-revision.entity';

export interface LimitsSectionResponse {
  locations: ScopeLocationEntity[];
  employeeGroups: ScopeEmployeeGroupEntity[];
  assets: ScopeAssetEntity[];
  providers: ScopeProviderEntity[];
  approval: ScopeApprovalEntity | null;
  revisions: ScopeRevisionEntity[];
}

/** Etapa 7 - Limites & Recursos (PRD secao 14). Persistencia das 6 subsecoes. */
@Injectable()
export class LimitsService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(ScopeLocationEntity)
    private readonly locationsRepository: Repository<ScopeLocationEntity>,
    @InjectRepository(ScopeEmployeeGroupEntity)
    private readonly employeeGroupsRepository: Repository<ScopeEmployeeGroupEntity>,
    @InjectRepository(ScopeAssetEntity)
    private readonly assetsRepository: Repository<ScopeAssetEntity>,
    @InjectRepository(ScopeProviderEntity)
    private readonly providersRepository: Repository<ScopeProviderEntity>,
    @InjectRepository(ScopeApprovalEntity)
    private readonly approvalsRepository: Repository<ScopeApprovalEntity>,
    @InjectRepository(ScopeRevisionEntity)
    private readonly revisionsRepository: Repository<ScopeRevisionEntity>,
  ) {}

  async getSection(projectId: string): Promise<LimitsSectionResponse> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    const [locations, employeeGroups, assets, providers, approval, revisions] =
      await Promise.all([
        this.locationsRepository.find({
          where: { sgsiScopeId },
          order: { createdAt: 'ASC' },
        }),
        this.employeeGroupsRepository.find({
          where: { sgsiScopeId },
          order: { createdAt: 'ASC' },
        }),
        this.assetsRepository.find({
          where: { sgsiScopeId },
          order: { createdAt: 'ASC' },
        }),
        this.providersRepository.find({
          where: { sgsiScopeId },
          order: { createdAt: 'ASC' },
        }),
        this.approvalsRepository.findOne({ where: { sgsiScopeId } }),
        this.revisionsRepository.find({
          where: { sgsiScopeId },
          order: { revisedAt: 'DESC', createdAt: 'DESC' },
        }),
      ]);

    return {
      locations,
      employeeGroups,
      assets,
      providers,
      approval: approval ?? null,
      revisions,
    };
  }

  // Localidades (7.1)

  async createLocation(
    projectId: string,
    dto: CreateScopeLocationDto,
  ): Promise<ScopeLocationEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.locationsRepository.save(
      this.locationsRepository.create({
        sgsiScopeId,
        name: dto.name,
        address: dto.address ?? null,
        description: dto.description ?? null,
        classification: dto.classification ?? null,
      }),
    );
  }

  async updateLocation(
    projectId: string,
    locationId: string,
    dto: UpdateScopeLocationDto,
  ): Promise<ScopeLocationEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const location = await this.locationsRepository.findOne({
      where: { id: locationId, sgsiScopeId },
    });

    if (!location) {
      throw new NotFoundException('Scope location not found.');
    }

    Object.assign(location, dto);

    return this.locationsRepository.save(location);
  }

  async removeLocation(projectId: string, locationId: string): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const location = await this.locationsRepository.findOne({
      where: { id: locationId, sgsiScopeId },
    });

    if (!location) {
      throw new NotFoundException('Scope location not found.');
    }

    await this.locationsRepository.remove(location);
  }

  // Colaboradores / areas (7.2)

  async createEmployeeGroup(
    projectId: string,
    dto: CreateScopeEmployeeGroupDto,
  ): Promise<ScopeEmployeeGroupEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.employeeGroupsRepository.save(
      this.employeeGroupsRepository.create({
        sgsiScopeId,
        areaOrGroup: dto.areaOrGroup,
        quantity: dto.quantity ?? null,
        description: dto.description ?? null,
        classification: dto.classification ?? null,
      }),
    );
  }

  async updateEmployeeGroup(
    projectId: string,
    groupId: string,
    dto: UpdateScopeEmployeeGroupDto,
  ): Promise<ScopeEmployeeGroupEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const group = await this.employeeGroupsRepository.findOne({
      where: { id: groupId, sgsiScopeId },
    });

    if (!group) {
      throw new NotFoundException('Scope employee group not found.');
    }

    Object.assign(group, dto);

    return this.employeeGroupsRepository.save(group);
  }

  async removeEmployeeGroup(projectId: string, groupId: string): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const group = await this.employeeGroupsRepository.findOne({
      where: { id: groupId, sgsiScopeId },
    });

    if (!group) {
      throw new NotFoundException('Scope employee group not found.');
    }

    await this.employeeGroupsRepository.remove(group);
  }

  // Ativos tecnologicos (7.3)

  async createAsset(
    projectId: string,
    dto: CreateScopeAssetDto,
  ): Promise<ScopeAssetEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.assetsRepository.save(
      this.assetsRepository.create({
        sgsiScopeId,
        assetName: dto.assetName,
        category: dto.category ?? null,
        description: dto.description ?? null,
        responsible: dto.responsible ?? null,
        classification: dto.classification ?? null,
      }),
    );
  }

  async updateAsset(
    projectId: string,
    assetId: string,
    dto: UpdateScopeAssetDto,
  ): Promise<ScopeAssetEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const asset = await this.assetsRepository.findOne({
      where: { id: assetId, sgsiScopeId },
    });

    if (!asset) {
      throw new NotFoundException('Scope asset not found.');
    }

    Object.assign(asset, dto);

    return this.assetsRepository.save(asset);
  }

  async removeAsset(projectId: string, assetId: string): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const asset = await this.assetsRepository.findOne({
      where: { id: assetId, sgsiScopeId },
    });

    if (!asset) {
      throw new NotFoundException('Scope asset not found.');
    }

    await this.assetsRepository.remove(asset);
  }

  // Prestadores de servico (7.4)

  async createProvider(
    projectId: string,
    dto: CreateScopeProviderDto,
  ): Promise<ScopeProviderEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.providersRepository.save(
      this.providersRepository.create({
        sgsiScopeId,
        providerName: dto.providerName,
        service: dto.service ?? null,
        description: dto.description ?? null,
        classification: dto.classification ?? null,
      }),
    );
  }

  async updateProvider(
    projectId: string,
    providerId: string,
    dto: UpdateScopeProviderDto,
  ): Promise<ScopeProviderEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const provider = await this.providersRepository.findOne({
      where: { id: providerId, sgsiScopeId },
    });

    if (!provider) {
      throw new NotFoundException('Scope provider not found.');
    }

    Object.assign(provider, dto);

    return this.providersRepository.save(provider);
  }

  async removeProvider(projectId: string, providerId: string): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const provider = await this.providersRepository.findOne({
      where: { id: providerId, sgsiScopeId },
    });

    if (!provider) {
      throw new NotFoundException('Scope provider not found.');
    }

    await this.providersRepository.remove(provider);
  }

  // Aprovacao (7.5) - registro unico, criado sob demanda (mesmo padrao de ScopeDefinition)

  async updateApproval(
    projectId: string,
    dto: UpdateScopeApprovalDto,
  ): Promise<ScopeApprovalEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const existing = await this.approvalsRepository.findOne({
      where: { sgsiScopeId },
    });

    if (existing) {
      Object.assign(existing, dto);

      return this.approvalsRepository.save(existing);
    }

    return this.approvalsRepository.save(
      this.approvalsRepository.create({
        sgsiScopeId,
        method: dto.method ?? null,
        platform: dto.platform ?? null,
        approvalText: dto.approvalText ?? null,
        responsible: dto.responsible ?? null,
        approvedAt: dto.approvedAt ?? null,
        observations: dto.observations ?? null,
      }),
    );
  }

  // Revisoes (7.6) - so criacao/listagem, sem update/delete (log de historico)

  async createRevision(
    projectId: string,
    dto: CreateScopeRevisionDto,
  ): Promise<ScopeRevisionEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.revisionsRepository.save(
      this.revisionsRepository.create({ ...dto, sgsiScopeId }),
    );
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
