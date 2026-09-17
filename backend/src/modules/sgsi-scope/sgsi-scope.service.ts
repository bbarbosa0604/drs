import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ModuleKey } from '../../common/enums/module-key.enum';
import { SgsiScopeVersionStatus } from '../../common/enums/sgsi-scope-version-status.enum';
import { ModuleInstanceEntity } from '../module-instances/entities/module-instance.entity';
import { type UpdateDocumentControlDto } from './dto/update-document-control.dto';
import { DocumentControlEntity } from './entities/document-control.entity';
import { SgsiScopeVersionEntity } from './entities/sgsi-scope-version.entity';
import { SgsiScopeEntity } from './entities/sgsi-scope.entity';

export interface SgsiScopeResponse extends SgsiScopeEntity {
  currentVersionNumber: number;
  currentVersionStatus: SgsiScopeVersionStatus;
  documentControl: DocumentControlEntity | null;
}

@Injectable()
export class SgsiScopeService {
  constructor(
    @InjectRepository(ModuleInstanceEntity)
    private readonly moduleInstancesRepository: Repository<ModuleInstanceEntity>,
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(SgsiScopeVersionEntity)
    private readonly sgsiScopeVersionsRepository: Repository<SgsiScopeVersionEntity>,
    @InjectRepository(DocumentControlEntity)
    private readonly documentControlsRepository: Repository<DocumentControlEntity>,
  ) {}

  /**
   * Idempotente: ativar duas vezes o mesmo modulo no mesmo projeto retorna a
   * instancia existente em vez de duplicar (unique index em module_instances).
   */
  async activateModule(
    projectId: string,
    moduleKey: ModuleKey,
  ): Promise<{ created: boolean; sgsiScope: SgsiScopeResponse }> {
    const existingModuleInstance = await this.moduleInstancesRepository.findOne(
      { where: { projectId, moduleKey } },
    );

    if (existingModuleInstance) {
      const existingSgsiScope = await this.sgsiScopesRepository.findOne({
        where: { moduleInstanceId: existingModuleInstance.id },
      });

      if (existingSgsiScope) {
        return {
          created: false,
          sgsiScope: await this.toResponse(existingSgsiScope),
        };
      }
    }

    const moduleInstance =
      existingModuleInstance ??
      (await this.moduleInstancesRepository.save(
        this.moduleInstancesRepository.create({ projectId, moduleKey }),
      ));

    const sgsiScope = await this.sgsiScopesRepository.save(
      this.sgsiScopesRepository.create({
        projectId,
        moduleInstanceId: moduleInstance.id,
      }),
    );

    await this.sgsiScopeVersionsRepository.save(
      this.sgsiScopeVersionsRepository.create({
        sgsiScopeId: sgsiScope.id,
        versionNumber: 1,
        status: SgsiScopeVersionStatus.DRAFT,
      }),
    );

    await this.documentControlsRepository.save(
      this.documentControlsRepository.create({ sgsiScopeId: sgsiScope.id }),
    );

    return { created: true, sgsiScope: await this.toResponse(sgsiScope) };
  }

  async getByProjectId(projectId: string): Promise<SgsiScopeResponse> {
    const sgsiScope = await this.findEntityByProjectId(projectId);

    return this.toResponse(sgsiScope);
  }

  async updateDocumentControl(
    projectId: string,
    dto: UpdateDocumentControlDto,
  ): Promise<DocumentControlEntity> {
    const sgsiScope = await this.findEntityByProjectId(projectId);
    const documentControl = await this.documentControlsRepository.findOne({
      where: { sgsiScopeId: sgsiScope.id },
    });

    if (!documentControl) {
      throw new NotFoundException('Document control not found.');
    }

    Object.assign(documentControl, dto);

    return this.documentControlsRepository.save(documentControl);
  }

  private async findEntityByProjectId(
    projectId: string,
  ): Promise<SgsiScopeEntity> {
    const sgsiScope = await this.sgsiScopesRepository.findOne({
      where: { projectId },
    });

    if (!sgsiScope) {
      throw new NotFoundException(
        'SGSI Scope module has not been activated for this project.',
      );
    }

    return sgsiScope;
  }

  private async toResponse(
    sgsiScope: SgsiScopeEntity,
  ): Promise<SgsiScopeResponse> {
    const [currentVersion, documentControl] = await Promise.all([
      this.sgsiScopeVersionsRepository.findOne({
        where: { sgsiScopeId: sgsiScope.id },
        order: { versionNumber: 'DESC' },
      }),
      this.documentControlsRepository.findOne({
        where: { sgsiScopeId: sgsiScope.id },
      }),
    ]);

    return {
      ...sgsiScope,
      currentVersionNumber: currentVersion?.versionNumber ?? 1,
      currentVersionStatus:
        currentVersion?.status ?? SgsiScopeVersionStatus.DRAFT,
      documentControl: documentControl ?? null,
    };
  }
}
