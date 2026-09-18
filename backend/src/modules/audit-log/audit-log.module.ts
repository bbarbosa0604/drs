import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationsModule } from '../organizations/organizations.module';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { AuditLogEntity } from './entities/audit-log.entity';

/**
 * PRD secao 21 (Task 027). `AuditLogService` e exportado para outros
 * modulos gravarem auditoria de forma centralizada (ex.:
 * `SgsiScopeVersioningModule`), em vez de cada um criar/salvar
 * `AuditLogEntity` manualmente.
 */
@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity]), OrganizationsModule],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
