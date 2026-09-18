import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogEntity } from './entities/audit-log.entity';

export interface RecordAuditLogInput {
  organizationId: string;
  projectId?: string | null;
  userId: string;
  entity: string;
  entityId: string;
  action: AuditAction;
  metadata?: Record<string, unknown> | null;
}

export interface PaginatedAuditLog {
  items: AuditLogEntity[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Ponto unico de gravacao de auditoria (PRD secao 21, Task 027) — "nao
 * espalhar chamadas manuais em cada controller". Servicos que precisam
 * auditar uma operacao devem chamar `record()` daqui, nao criar/salvar
 * `AuditLogEntity` diretamente.
 *
 * Pendencia registrada (Task 027): `ProjectsService.update` (Task 006) ja
 * grava `AuditLog` manualmente, criado antes deste service existir. Migrar
 * esse ponto para `record()` e um follow-up — esta task nao reescreve
 * codigo de modulos fora do seu path de escrita (`audit-log/**`,
 * `sgsi-scope/versioning/**`).
 */
@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogsRepository: Repository<AuditLogEntity>,
  ) {}

  async record(input: RecordAuditLogInput): Promise<AuditLogEntity> {
    return this.auditLogsRepository.save(
      this.auditLogsRepository.create({
        organizationId: input.organizationId,
        projectId: input.projectId ?? null,
        userId: input.userId,
        entity: input.entity,
        entityId: input.entityId,
        action: input.action,
        metadata: input.metadata ?? null,
      }),
    );
  }

  /** PRD - Task 027, casos de erro: volume alto de eventos exige paginacao basica. */
  async findByOrganization(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedAuditLog> {
    const [items, total] = await this.auditLogsRepository.findAndCount({
      where: { organizationId },
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }
}
