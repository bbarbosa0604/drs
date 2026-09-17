import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProjectAccessGuard } from '../../../common/guards/project-access.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ContextService } from './context.service';
import { CreateContextAspectDto } from './dto/create-context-aspect.dto';
import { UpdateContextAspectDto } from './dto/update-context-aspect.dto';
import { UpdateOrganizationContextDto } from './dto/update-organization-context.dto';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/context')
export class ContextController {
  constructor(private readonly contextService: ContextService) {}

  @Get()
  getSection(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.contextService.getSection(projectId);
  }

  @Patch('history')
  updateHistory(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: UpdateOrganizationContextDto,
  ) {
    return this.contextService.updateHistory(projectId, dto);
  }

  @Post('aspects')
  createAspect(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateContextAspectDto,
  ) {
    return this.contextService.createAspect(projectId, dto);
  }

  @Patch('aspects/:aspectId')
  updateAspect(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('aspectId', new ParseUUIDPipe()) aspectId: string,
    @Body() dto: UpdateContextAspectDto,
  ) {
    return this.contextService.updateAspect(projectId, aspectId, dto);
  }

  @Delete('aspects/:aspectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAspect(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('aspectId', new ParseUUIDPipe()) aspectId: string,
  ) {
    await this.contextService.removeAspect(projectId, aspectId);
  }
}
