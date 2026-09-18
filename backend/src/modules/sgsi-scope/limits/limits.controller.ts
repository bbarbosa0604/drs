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
  CreateScopeAssetDto,
  UpdateScopeAssetDto,
} from './dto/scope-asset.dto';
import { CreateScopeRevisionDto } from './dto/create-scope-revision.dto';
import {
  CreateScopeEmployeeGroupDto,
  UpdateScopeEmployeeGroupDto,
} from './dto/scope-employee-group.dto';
import {
  CreateScopeLocationDto,
  UpdateScopeLocationDto,
} from './dto/scope-location.dto';
import {
  CreateScopeProviderDto,
  UpdateScopeProviderDto,
} from './dto/scope-provider.dto';
import { UpdateScopeApprovalDto } from './dto/update-scope-approval.dto';
import { LimitsService } from './limits.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/limits')
export class LimitsController {
  constructor(private readonly limitsService: LimitsService) {}

  @Get()
  getSection(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.limitsService.getSection(projectId);
  }

  @Post('locations')
  createLocation(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateScopeLocationDto,
  ) {
    return this.limitsService.createLocation(projectId, dto);
  }

  @Patch('locations/:locationId')
  updateLocation(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('locationId', new ParseUUIDPipe()) locationId: string,
    @Body() dto: UpdateScopeLocationDto,
  ) {
    return this.limitsService.updateLocation(projectId, locationId, dto);
  }

  @Delete('locations/:locationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLocation(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('locationId', new ParseUUIDPipe()) locationId: string,
  ) {
    await this.limitsService.removeLocation(projectId, locationId);
  }

  @Post('employee-groups')
  createEmployeeGroup(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateScopeEmployeeGroupDto,
  ) {
    return this.limitsService.createEmployeeGroup(projectId, dto);
  }

  @Patch('employee-groups/:groupId')
  updateEmployeeGroup(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
    @Body() dto: UpdateScopeEmployeeGroupDto,
  ) {
    return this.limitsService.updateEmployeeGroup(projectId, groupId, dto);
  }

  @Delete('employee-groups/:groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeEmployeeGroup(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
  ) {
    await this.limitsService.removeEmployeeGroup(projectId, groupId);
  }

  @Post('assets')
  createAsset(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateScopeAssetDto,
  ) {
    return this.limitsService.createAsset(projectId, dto);
  }

  @Patch('assets/:assetId')
  updateAsset(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('assetId', new ParseUUIDPipe()) assetId: string,
    @Body() dto: UpdateScopeAssetDto,
  ) {
    return this.limitsService.updateAsset(projectId, assetId, dto);
  }

  @Delete('assets/:assetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAsset(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('assetId', new ParseUUIDPipe()) assetId: string,
  ) {
    await this.limitsService.removeAsset(projectId, assetId);
  }

  @Post('providers')
  createProvider(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateScopeProviderDto,
  ) {
    return this.limitsService.createProvider(projectId, dto);
  }

  @Patch('providers/:providerId')
  updateProvider(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('providerId', new ParseUUIDPipe()) providerId: string,
    @Body() dto: UpdateScopeProviderDto,
  ) {
    return this.limitsService.updateProvider(projectId, providerId, dto);
  }

  @Delete('providers/:providerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeProvider(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('providerId', new ParseUUIDPipe()) providerId: string,
  ) {
    await this.limitsService.removeProvider(projectId, providerId);
  }

  @Patch('approval')
  updateApproval(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: UpdateScopeApprovalDto,
  ) {
    return this.limitsService.updateApproval(projectId, dto);
  }

  @Post('revisions')
  createRevision(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateScopeRevisionDto,
  ) {
    return this.limitsService.createRevision(projectId, dto);
  }
}
