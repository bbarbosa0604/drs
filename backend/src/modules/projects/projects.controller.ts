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
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  CurrentUser,
  type RequestUser,
} from '../../common/decorators/current-user.decorator';
import { ProjectAccessGuard } from '../../common/guards/project-access.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectInputDto } from './dto/project-input.dto';
import { ProjectsService } from './projects.service';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(
    @CurrentUser() user: RequestUser,
    @Query('organizationId') organizationId?: string,
  ) {
    return this.projectsService.findAllForUser(user, organizationId);
  }

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: ProjectInputDto) {
    return this.projectsService.create(user, dto);
  }

  @UseGuards(ProjectAccessGuard)
  @Get(':projectId')
  findOne(@Param('projectId', new ParseUUIDPipe()) id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(ProjectAccessGuard)
  @Patch(':projectId')
  update(
    @Param('projectId', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: ProjectInputDto,
  ) {
    return this.projectsService.update(id, user, dto);
  }

  @UseGuards(ProjectAccessGuard)
  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('projectId', new ParseUUIDPipe()) id: string) {
    await this.projectsService.remove(id);
  }
}
