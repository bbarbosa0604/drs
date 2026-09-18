import {
  Controller,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { ProjectAccessGuard } from '../../common/guards/project-access.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentGenerationService } from './document-generation.service';

@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@Controller('projects/:projectId/sgsi-scope/documents')
export class DocumentGenerationController {
  constructor(
    private readonly documentGenerationService: DocumentGenerationService,
  ) {}

  @Post('scope-declaration')
  generateScopeDeclaration(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.documentGenerationService.generateScopeDeclaration(projectId);
  }

  @Post('approval-proposal')
  generateApprovalProposal(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.documentGenerationService.generateApprovalProposal(projectId);
  }

  @Post('approval-presentation')
  generateApprovalPresentation(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.documentGenerationService.generateApprovalPresentation(
      projectId,
    );
  }

  @Get(':documentId/download')
  @Header('Cache-Control', 'no-store')
  async download(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('documentId', new ParseUUIDPipe()) documentId: string,
    @Res() response: Response,
  ) {
    const file = await this.documentGenerationService.getDocumentFile(
      projectId,
      documentId,
    );

    response.setHeader('Content-Type', file.mimeType);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.fileName}"`,
    );
    response.send(file.buffer);
  }
}
