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
  CreateArchitectureComponentDto,
  UpdateArchitectureComponentDto,
} from './dto/architecture-component.dto';
import {
  CreateArchitectureInterfaceDto,
  UpdateArchitectureInterfaceDto,
} from './dto/architecture-interface.dto';
import { ArchitectureService } from './architecture.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/architecture')
export class ArchitectureController {
  constructor(private readonly architectureService: ArchitectureService) {}

  @Get()
  getSection(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.architectureService.getSection(projectId);
  }

  @Post('components')
  createComponent(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateArchitectureComponentDto,
  ) {
    return this.architectureService.createComponent(projectId, dto);
  }

  @Patch('components/:componentId')
  updateComponent(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('componentId', new ParseUUIDPipe()) componentId: string,
    @Body() dto: UpdateArchitectureComponentDto,
  ) {
    return this.architectureService.updateComponent(
      projectId,
      componentId,
      dto,
    );
  }

  @Delete('components/:componentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeComponent(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('componentId', new ParseUUIDPipe()) componentId: string,
  ) {
    await this.architectureService.removeComponent(projectId, componentId);
  }

  @Post('interfaces')
  createInterface(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateArchitectureInterfaceDto,
  ) {
    return this.architectureService.createInterface(projectId, dto);
  }

  @Patch('interfaces/:interfaceId')
  updateInterface(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('interfaceId', new ParseUUIDPipe()) interfaceId: string,
    @Body() dto: UpdateArchitectureInterfaceDto,
  ) {
    return this.architectureService.updateInterface(
      projectId,
      interfaceId,
      dto,
    );
  }

  @Delete('interfaces/:interfaceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeInterface(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('interfaceId', new ParseUUIDPipe()) interfaceId: string,
  ) {
    await this.architectureService.removeInterface(projectId, interfaceId);
  }
}
