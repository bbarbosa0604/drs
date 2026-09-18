import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationEntity } from '../organizations/entities/organization.entity';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectEntity } from '../projects/entities/project.entity';
import { ScopeApprovalEntity } from '../sgsi-scope/limits/entities/scope-approval.entity';
import { ScopeDefinitionEntity } from '../sgsi-scope/scope-definition/entities/scope-definition.entity';
import { SgsiScopeVersionEntity } from '../sgsi-scope/entities/sgsi-scope-version.entity';
import { SgsiScopeEntity } from '../sgsi-scope/entities/sgsi-scope.entity';
import { DocumentGenerationController } from './document-generation.controller';
import { DocumentGenerationService } from './document-generation.service';
import { GeneratedDocumentEntity } from './entities/generated-document.entity';
import { DOCUMENT_STORAGE_ADAPTER } from './storage/document-storage.interface';
import { LocalFilesystemStorageAdapter } from './storage/local-filesystem-storage.adapter';

/** Slice 006 - Previa, Documentos & Productizacao (Task 026, PRD secao 17). */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SgsiScopeEntity,
      SgsiScopeVersionEntity,
      ProjectEntity,
      OrganizationEntity,
      ScopeDefinitionEntity,
      ScopeApprovalEntity,
      GeneratedDocumentEntity,
    ]),
    ProjectsModule,
  ],
  controllers: [DocumentGenerationController],
  providers: [
    DocumentGenerationService,
    {
      provide: DOCUMENT_STORAGE_ADAPTER,
      useClass: LocalFilesystemStorageAdapter,
    },
  ],
})
export class DocumentGenerationModule {}
