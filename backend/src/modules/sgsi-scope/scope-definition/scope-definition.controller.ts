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
  CreateScopeListItemDto,
  UpdateScopeListItemDto,
} from './dto/scope-list-item.dto';
import { UpdateScopeDefinitionDto } from './dto/update-scope-definition.dto';
import { ScopeDefinitionService } from './scope-definition.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/scope-definition')
export class ScopeDefinitionController {
  constructor(
    private readonly scopeDefinitionService: ScopeDefinitionService,
  ) {}

  @Get()
  getSection(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.scopeDefinitionService.getSection(projectId);
  }

  @Patch()
  updateDefinition(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: UpdateScopeDefinitionDto,
  ) {
    return this.scopeDefinitionService.updateDefinition(projectId, dto);
  }

  @Post('characteristics')
  createCharacteristic(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateScopeListItemDto,
  ) {
    return this.scopeDefinitionService.createCharacteristic(projectId, dto);
  }

  @Patch('characteristics/:characteristicId')
  updateCharacteristic(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('characteristicId', new ParseUUIDPipe()) characteristicId: string,
    @Body() dto: UpdateScopeListItemDto,
  ) {
    return this.scopeDefinitionService.updateCharacteristic(
      projectId,
      characteristicId,
      dto,
    );
  }

  @Delete('characteristics/:characteristicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCharacteristic(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('characteristicId', new ParseUUIDPipe()) characteristicId: string,
  ) {
    await this.scopeDefinitionService.removeCharacteristic(
      projectId,
      characteristicId,
    );
  }

  @Post('benefits')
  createBenefit(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateScopeListItemDto,
  ) {
    return this.scopeDefinitionService.createBenefit(projectId, dto);
  }

  @Patch('benefits/:benefitId')
  updateBenefit(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('benefitId', new ParseUUIDPipe()) benefitId: string,
    @Body() dto: UpdateScopeListItemDto,
  ) {
    return this.scopeDefinitionService.updateBenefit(projectId, benefitId, dto);
  }

  @Delete('benefits/:benefitId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBenefit(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('benefitId', new ParseUUIDPipe()) benefitId: string,
  ) {
    await this.scopeDefinitionService.removeBenefit(projectId, benefitId);
  }
}
