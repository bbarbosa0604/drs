import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { ProjectAccessGuard } from '../../../common/guards/project-access.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FillPercentageService } from './fill-percentage.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope')
export class FillPercentageController {
  constructor(private readonly fillPercentageService: FillPercentageService) {}

  @Get('fill-percentage')
  calculate(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.fillPercentageService.calculate(projectId);
  }
}
