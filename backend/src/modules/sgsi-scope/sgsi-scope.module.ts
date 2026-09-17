import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModuleInstanceEntity } from '../module-instances/entities/module-instance.entity';
import { ProjectsModule } from '../projects/projects.module';
import { DocumentControlEntity } from './entities/document-control.entity';
import { SgsiScopeVersionEntity } from './entities/sgsi-scope-version.entity';
import { SgsiScopeEntity } from './entities/sgsi-scope.entity';
import { SgsiScopeController } from './sgsi-scope.controller';
import { SgsiScopeService } from './sgsi-scope.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleInstanceEntity,
      SgsiScopeEntity,
      SgsiScopeVersionEntity,
      DocumentControlEntity,
    ]),
    ProjectsModule,
  ],
  controllers: [SgsiScopeController],
  providers: [SgsiScopeService],
})
export class SgsiScopeModule {}
