import { BadRequestException, ConflictException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { TopologyNodeType } from '../../../common/enums/topology-node-type.enum';
import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { type TopologyLinkEntity } from './entities/topology-link.entity';
import { type TopologyNodeEntity } from './entities/topology-node.entity';
import { TopologyService } from './topology.service';

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    count: jest.fn<Promise<number>, [unknown?]>(),
    create: jest.fn((input: Partial<T>) => input as T),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
    remove: jest.fn((entity: unknown) => Promise.resolve(entity)),
  };
}

function buildService() {
  const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
  const nodesRepository = buildRepositoryMock<TopologyNodeEntity>();
  const linksRepository = buildRepositoryMock<TopologyLinkEntity>();

  const service = new TopologyService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    nodesRepository as unknown as Repository<TopologyNodeEntity>,
    linksRepository as unknown as Repository<TopologyLinkEntity>,
  );

  return { service, sgsiScopesRepository, nodesRepository, linksRepository };
}

describe('TopologyService', () => {
  it('creates a node scoped to the project SgsiScope, without forcing a classification', async () => {
    const { service, sgsiScopesRepository, nodesRepository } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);

    await service.createNode('project-1', {
      name: 'Firewall perimetral',
      type: TopologyNodeType.FIREWALL,
    });

    expect(nodesRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        type: TopologyNodeType.FIREWALL,
        classification: null,
      }),
    );
  });

  it('rejects a link pointing to a node that does not exist (400, PRD - casos de erro)', async () => {
    const { service, sgsiScopesRepository, nodesRepository } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    nodesRepository.findOne.mockResolvedValue(null);

    await expect(
      service.createLink('project-1', {
        fromNodeId: 'node-1',
        toNodeId: 'no-existe',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a link when both nodes exist in the same scope', async () => {
    const { service, sgsiScopesRepository, nodesRepository, linksRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    nodesRepository.findOne.mockResolvedValue({
      id: 'node-1',
      sgsiScopeId: 'sgsi-scope-1',
    } as TopologyNodeEntity);

    await service.createLink('project-1', {
      fromNodeId: 'node-1',
      toNodeId: 'node-2',
    });

    expect(linksRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        fromNodeId: 'node-1',
        toNodeId: 'node-2',
      }),
    );
  });

  it('blocks removing a node still referenced by a link (409, PRD - casos de erro)', async () => {
    const { service, sgsiScopesRepository, nodesRepository, linksRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    nodesRepository.findOne.mockResolvedValue({
      id: 'node-1',
      sgsiScopeId: 'sgsi-scope-1',
    } as TopologyNodeEntity);
    linksRepository.count.mockResolvedValue(1);

    await expect(
      service.removeNode('project-1', 'node-1'),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(nodesRepository.remove).not.toHaveBeenCalled();
  });

  it('removes a node with no referencing links', async () => {
    const { service, sgsiScopesRepository, nodesRepository, linksRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    nodesRepository.findOne.mockResolvedValue({
      id: 'node-1',
      sgsiScopeId: 'sgsi-scope-1',
    } as TopologyNodeEntity);
    linksRepository.count.mockResolvedValue(0);

    await service.removeNode('project-1', 'node-1');

    expect(nodesRepository.remove).toHaveBeenCalled();
  });
});
