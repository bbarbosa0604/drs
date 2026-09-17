import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from '../../projects/projects.module';
import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { ContextController } from './context.controller';
import { ContextService } from './context.service';
import { ContextAspectEntity } from './entities/context-aspect.entity';
import { OrganizationContextEntity } from './entities/organization-context.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SgsiScopeEntity,
      OrganizationContextEntity,
      ContextAspectEntity,
    ]),
    ProjectsModule,
  ],
  controllers: [ContextController],
  providers: [ContextService],
})
export class ContextModule {}
