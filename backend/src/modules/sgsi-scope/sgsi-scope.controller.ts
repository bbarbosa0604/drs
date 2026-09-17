import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { ProjectAccessGuard } from '../../common/guards/project-access.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivateModuleDto } from './dto/activate-module.dto';
import { UpdateDocumentControlDto } from './dto/update-document-control.dto';
import { SgsiScopeService } from './sgsi-scope.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId')
export class SgsiScopeController {
  constructor(private readonly sgsiScopeService: SgsiScopeService) {}

  @Post('modules')
  async activateModule(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: ActivateModuleDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { created, sgsiScope } = await this.sgsiScopeService.activateModule(
      projectId,
      dto.moduleKey,
    );

    response.status(created ? HttpStatus.CREATED : HttpStatus.OK);

    return sgsiScope;
  }

  @Get('sgsi-scope')
  getSgsiScope(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.sgsiScopeService.getByProjectId(projectId);
  }

  @Patch('sgsi-scope/document-control')
  @HttpCode(HttpStatus.OK)
  updateDocumentControl(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: UpdateDocumentControlDto,
  ) {
    return this.sgsiScopeService.updateDocumentControl(projectId, dto);
  }
}
