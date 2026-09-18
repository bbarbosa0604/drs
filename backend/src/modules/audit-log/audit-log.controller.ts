import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { OrganizationAccessGuard } from '../../common/guards/organization-access.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditLogService } from './audit-log.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

/**
 * Consulta de auditoria restrita por vinculo a organizacao (Task 027, PRD
 * secao 21/23) — `OrganizationAccessGuard` recarrega o vinculo a cada
 * request, DSR Admin tem acesso irrestrito (mesma regra das demais rotas).
 */
@UseGuards(JwtAuthGuard, OrganizationAccessGuard)
@Controller('organizations/:organizationId/audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  list(
    @Param('organizationId', new ParseUUIDPipe()) organizationId: string,
    @Query() query: QueryAuditLogDto,
  ) {
    return this.auditLogService.findByOrganization(
      organizationId,
      query.page ?? 1,
      query.limit ?? 20,
    );
  }
}
