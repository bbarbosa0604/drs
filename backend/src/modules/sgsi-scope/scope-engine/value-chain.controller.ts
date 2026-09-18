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
  CreateValueChainBlockDto,
  UpdateValueChainBlockDto,
} from './dto/value-chain-block.dto';
import { ValueChainService } from './value-chain.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/value-chain')
export class ValueChainController {
  constructor(private readonly valueChainService: ValueChainService) {}

  @Get()
  getSection(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.valueChainService.getSection(projectId);
  }

  @Post('blocks')
  createBlock(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateValueChainBlockDto,
  ) {
    return this.valueChainService.createBlock(projectId, dto);
  }

  @Patch('blocks/:blockId')
  updateBlock(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('blockId', new ParseUUIDPipe()) blockId: string,
    @Body() dto: UpdateValueChainBlockDto,
  ) {
    return this.valueChainService.updateBlock(projectId, blockId, dto);
  }

  @Delete('blocks/:blockId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBlock(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('blockId', new ParseUUIDPipe()) blockId: string,
  ) {
    await this.valueChainService.removeBlock(projectId, blockId);
  }
}
