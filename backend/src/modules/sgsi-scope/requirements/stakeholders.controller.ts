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
  CreateStakeholderDto,
  UpdateStakeholderDto,
} from './dto/stakeholder.dto';
import { StakeholdersService } from './stakeholders.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/stakeholders')
export class StakeholdersController {
  constructor(private readonly stakeholdersService: StakeholdersService) {}

  @Get()
  list(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.stakeholdersService.list(projectId);
  }

  @Post()
  create(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateStakeholderDto,
  ) {
    return this.stakeholdersService.create(projectId, dto);
  }

  @Patch(':stakeholderId')
  update(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('stakeholderId', new ParseUUIDPipe()) stakeholderId: string,
    @Body() dto: UpdateStakeholderDto,
  ) {
    return this.stakeholdersService.update(projectId, stakeholderId, dto);
  }

  @Delete(':stakeholderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('stakeholderId', new ParseUUIDPipe()) stakeholderId: string,
  ) {
    await this.stakeholdersService.remove(projectId, stakeholderId);
  }
}
