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
  type CreateArchitectureComponentDto,
  type UpdateArchitectureComponentDto,
} from './dto/architecture-component.dto';
import {
  type CreateArchitectureInterfaceDto,
  type UpdateArchitectureInterfaceDto,
} from './dto/architecture-interface.dto';
import { ArchitectureComponentEntity } from './entities/architecture-component.entity';
import { ArchitectureInterfaceEntity } from './entities/architecture-interface.entity';

export interface ArchitectureSectionResponse {
  components: ArchitectureComponentEntity[];
  interfaces: ArchitectureInterfaceEntity[];
}

/** Etapa 6.2 - Arquitetura (PRD secao 13.2). Persistencia; render fica na Task 019. */
@Injectable()
export class ArchitectureService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(ArchitectureComponentEntity)
    private readonly componentsRepository: Repository<ArchitectureComponentEntity>,
    @InjectRepository(ArchitectureInterfaceEntity)
    private readonly interfacesRepository: Repository<ArchitectureInterfaceEntity>,
  ) {}

  async getSection(projectId: string): Promise<ArchitectureSectionResponse> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    const [components, interfaces] = await Promise.all([
      this.componentsRepository.find({
        where: { sgsiScopeId },
        order: { createdAt: 'ASC' },
      }),
      this.interfacesRepository.find({
        where: { sgsiScopeId },
        order: { createdAt: 'ASC' },
      }),
    ]);

    return { components, interfaces };
  }

  async createComponent(
    projectId: string,
    dto: CreateArchitectureComponentDto,
  ): Promise<ArchitectureComponentEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);

    return this.componentsRepository.save(
      this.componentsRepository.create({
        sgsiScopeId,
        name: dto.name,
        layer: dto.layer ?? null,
        description: dto.description ?? null,
        classification: dto.classification ?? null,
      }),
    );
  }

  async updateComponent(
    projectId: string,
    componentId: string,
    dto: UpdateArchitectureComponentDto,
  ): Promise<ArchitectureComponentEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const component = await this.componentsRepository.findOne({
      where: { id: componentId, sgsiScopeId },
    });

    if (!component) {
      throw new NotFoundException('Architecture component not found.');
    }

    Object.assign(component, dto);

    return this.componentsRepository.save(component);
  }

  async removeComponent(projectId: string, componentId: string): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const component = await this.componentsRepository.findOne({
      where: { id: componentId, sgsiScopeId },
    });

    if (!component) {
      throw new NotFoundException('Architecture component not found.');
    }

    const referencingInterfacesCount = await this.interfacesRepository.count({
      where: [{ fromComponentId: componentId }, { toComponentId: componentId }],
    });

    if (referencingInterfacesCount > 0) {
      throw new ConflictException(
        'This component is referenced by one or more architecture interfaces and cannot be removed. Remove the interfaces first.',
      );
    }

    await this.componentsRepository.remove(component);
  }

  async createInterface(
    projectId: string,
    dto: CreateArchitectureInterfaceDto,
  ): Promise<ArchitectureInterfaceEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    await this.findComponentOrFail(sgsiScopeId, dto.fromComponentId);
    await this.findComponentOrFail(sgsiScopeId, dto.toComponentId);

    return this.interfacesRepository.save(
      this.interfacesRepository.create({
        sgsiScopeId,
        fromComponentId: dto.fromComponentId,
        toComponentId: dto.toComponentId,
        description: dto.description ?? null,
      }),
    );
  }

  async updateInterface(
    projectId: string,
    interfaceId: string,
    dto: UpdateArchitectureInterfaceDto,
  ): Promise<ArchitectureInterfaceEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const architectureInterface = await this.interfacesRepository.findOne({
      where: { id: interfaceId, sgsiScopeId },
    });

    if (!architectureInterface) {
      throw new NotFoundException('Architecture interface not found.');
    }

    if (dto.fromComponentId !== undefined) {
      await this.findComponentOrFail(sgsiScopeId, dto.fromComponentId);
      architectureInterface.fromComponentId = dto.fromComponentId;
    }
    if (dto.toComponentId !== undefined) {
      await this.findComponentOrFail(sgsiScopeId, dto.toComponentId);
      architectureInterface.toComponentId = dto.toComponentId;
    }
    if (dto.description !== undefined) {
      architectureInterface.description = dto.description;
    }

    return this.interfacesRepository.save(architectureInterface);
  }

  async removeInterface(projectId: string, interfaceId: string): Promise<void> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const architectureInterface = await this.interfacesRepository.findOne({
      where: { id: interfaceId, sgsiScopeId },
    });

    if (!architectureInterface) {
      throw new NotFoundException('Architecture interface not found.');
    }

    await this.interfacesRepository.remove(architectureInterface);
  }

  private async findComponentOrFail(
    sgsiScopeId: string,
    componentId: string,
  ): Promise<ArchitectureComponentEntity> {
    const component = await this.componentsRepository.findOne({
      where: { id: componentId, sgsiScopeId },
    });

    if (!component) {
      throw new BadRequestException(
        `Architecture component "${componentId}" not found.`,
      );
    }

    return component;
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
