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
import {
  CreateProjectRequirementDto,
  UpdateProjectRequirementDto,
} from './dto/project-requirement.dto';
import { ProjectRequirementsService } from './project-requirements.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/requirements')
export class ProjectRequirementsController {
  constructor(
    private readonly projectRequirementsService: ProjectRequirementsService,
  ) {}

  @Get()
  list(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.projectRequirementsService.list(projectId);
  }

  @Post()
  create(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateProjectRequirementDto,
  ) {
    return this.projectRequirementsService.create(projectId, dto);
  }

  @Patch(':projectRequirementId')
  update(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('projectRequirementId', new ParseUUIDPipe())
    projectRequirementId: string,
    @Body() dto: UpdateProjectRequirementDto,
  ) {
    return this.projectRequirementsService.update(
      projectId,
      projectRequirementId,
      dto,
    );
  }

  @Delete(':projectRequirementId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('projectRequirementId', new ParseUUIDPipe())
    projectRequirementId: string,
  ) {
    await this.projectRequirementsService.remove(
      projectId,
      projectRequirementId,
    );
  }
}
