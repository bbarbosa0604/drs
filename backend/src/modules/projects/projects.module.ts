import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMemberEntity } from './entities/project-member.entity';
import { ProjectEntity } from './entities/project.entity';
import { ProjectsAccessService } from './projects-access.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, ProjectMemberEntity])],
  providers: [ProjectsAccessService],
  exports: [ProjectsAccessService],
})
export class ProjectsModule {}
