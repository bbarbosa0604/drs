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
  CreateGovernanceMemberDto,
  UpdateGovernanceCommitteeDto,
  UpdateGovernanceMemberDto,
} from './dto/governance.dto';
import { GovernanceService } from './governance.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/governance')
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Get()
  getSection(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.governanceService.getSection(projectId);
  }

  @Patch()
  updateCommittee(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: UpdateGovernanceCommitteeDto,
  ) {
    return this.governanceService.updateCommittee(projectId, dto);
  }

  @Post('members')
  createMember(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateGovernanceMemberDto,
  ) {
    return this.governanceService.createMember(projectId, dto);
  }

  @Patch('members/:memberId')
  updateMember(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('memberId', new ParseUUIDPipe()) memberId: string,
    @Body() dto: UpdateGovernanceMemberDto,
  ) {
    return this.governanceService.updateMember(projectId, memberId, dto);
  }

  @Delete('members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('memberId', new ParseUUIDPipe()) memberId: string,
  ) {
    await this.governanceService.removeMember(projectId, memberId);
  }
}
