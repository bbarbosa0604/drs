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
  CreateTopologyLinkDto,
  UpdateTopologyLinkDto,
} from './dto/topology-link.dto';
import {
  CreateTopologyNodeDto,
  UpdateTopologyNodeDto,
} from './dto/topology-node.dto';
import { TopologyService } from './topology.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/topology')
export class TopologyController {
  constructor(private readonly topologyService: TopologyService) {}

  @Get()
  getSection(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.topologyService.getSection(projectId);
  }

  @Post('nodes')
  createNode(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateTopologyNodeDto,
  ) {
    return this.topologyService.createNode(projectId, dto);
  }

  @Patch('nodes/:nodeId')
  updateNode(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('nodeId', new ParseUUIDPipe()) nodeId: string,
    @Body() dto: UpdateTopologyNodeDto,
  ) {
    return this.topologyService.updateNode(projectId, nodeId, dto);
  }

  @Delete('nodes/:nodeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeNode(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('nodeId', new ParseUUIDPipe()) nodeId: string,
  ) {
    await this.topologyService.removeNode(projectId, nodeId);
  }

  @Post('links')
  createLink(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateTopologyLinkDto,
  ) {
    return this.topologyService.createLink(projectId, dto);
  }

  @Patch('links/:linkId')
  updateLink(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('linkId', new ParseUUIDPipe()) linkId: string,
    @Body() dto: UpdateTopologyLinkDto,
  ) {
    return this.topologyService.updateLink(projectId, linkId, dto);
  }

  @Delete('links/:linkId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLink(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('linkId', new ParseUUIDPipe()) linkId: string,
  ) {
    await this.topologyService.removeLink(projectId, linkId);
  }
}
