import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationMemberEntity } from './entities/organization-member.entity';
import { OrganizationEntity } from './entities/organization.entity';
import { OrganizationsAccessService } from './organizations-access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationEntity, OrganizationMemberEntity]),
  ],
  providers: [OrganizationsAccessService],
  exports: [OrganizationsAccessService],
})
export class OrganizationsModule {}
