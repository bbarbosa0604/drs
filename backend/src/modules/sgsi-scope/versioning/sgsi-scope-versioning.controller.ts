import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProjectAccessGuard } from '../../../common/guards/project-access.guard';
import {
  CurrentUser,
  type RequestUser,
} from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SgsiScopeVersioningService } from './sgsi-scope-versioning.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/versions')
export class SgsiScopeVersioningController {
  constructor(private readonly versioningService: SgsiScopeVersioningService) {}

  @Get()
  listVersions(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.versioningService.listVersions(projectId);
  }

  @Post('request-edit')
  requestEditableVersion(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.versioningService.requestEditableVersion(
      projectId,
      user.userId,
    );
  }

  @Post('approve')
  approveCurrentVersion(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.versioningService.approveCurrentVersion(projectId, user.userId);
  }
}
