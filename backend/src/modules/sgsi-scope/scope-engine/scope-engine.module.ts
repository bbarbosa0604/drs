import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from '../../projects/projects.module';
import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { ArchitectureComponentEntity } from './entities/architecture-component.entity';
import { ArchitectureInterfaceEntity } from './entities/architecture-interface.entity';
import { TopologyLinkEntity } from './entities/topology-link.entity';
import { TopologyNodeEntity } from './entities/topology-node.entity';
import { ValueChainBlockEntity } from './entities/value-chain-block.entity';
import { ArchitectureController } from './architecture.controller';
import { ArchitectureService } from './architecture.service';
import { TopologyController } from './topology.controller';
import { TopologyService } from './topology.service';
import { ValueChainController } from './value-chain.controller';
import { ValueChainService } from './value-chain.service';

/** Slice 004 - Scope Engine (PRD secoes 12-13): persistencia das 5 entidades que alimentam os diagramas da Task 019. */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SgsiScopeEntity,
      ValueChainBlockEntity,
      TopologyNodeEntity,
      TopologyLinkEntity,
      ArchitectureComponentEntity,
      ArchitectureInterfaceEntity,
    ]),
    ProjectsModule,
  ],
  controllers: [
    ValueChainController,
    TopologyController,
    ArchitectureController,
  ],
  providers: [ValueChainService, TopologyService, ArchitectureService],
})
export class ScopeEngineModule {}
