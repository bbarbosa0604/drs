import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  type CreateRequirementDto,
  type UpdateRequirementDto,
} from './dto/requirement-library.dto';
import { RequirementEntity } from './entities/requirement.entity';

/**
 * Biblioteca global de requisitos (PRD secao 10.2/32) — decisao confirmada:
 * mantida pelo DSR Admin (`RolesGuard` no controller), lida por qualquer
 * usuario autenticado.
 */
@Injectable()
export class RequirementsLibraryService {
  constructor(
    @InjectRepository(RequirementEntity)
    private readonly requirementsRepository: Repository<RequirementEntity>,
  ) {}

  list(): Promise<RequirementEntity[]> {
    return this.requirementsRepository.find({ order: { title: 'ASC' } });
  }

  create(dto: CreateRequirementDto): Promise<RequirementEntity> {
    return this.requirementsRepository.save(
      this.requirementsRepository.create(dto),
    );
  }

  async update(
    id: string,
    dto: UpdateRequirementDto,
  ): Promise<RequirementEntity> {
    const requirement = await this.findOne(id);

    Object.assign(requirement, dto);

    return this.requirementsRepository.save(requirement);
  }

  async remove(id: string): Promise<void> {
    const requirement = await this.findOne(id);

    await this.requirementsRepository.remove(requirement);
  }

  private async findOne(id: string): Promise<RequirementEntity> {
    const requirement = await this.requirementsRepository.findOne({
      where: { id },
    });

    if (!requirement) {
      throw new NotFoundException('Requirement not found.');
    }

    return requirement;
  }
}
