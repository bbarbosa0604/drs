import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectEntity } from '../projects/entities/project.entity';
import { OrganizationMemberEntity } from './entities/organization-member.entity';
import { OrganizationEntity } from './entities/organization.entity';
import { OrganizationsAccessService } from './organizations-access.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationEntity,
      OrganizationMemberEntity,
      ProjectEntity,
    ]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsAccessService, OrganizationsService],
  exports: [OrganizationsAccessService],
})
export class OrganizationsModule {}
