import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import {
  type CreateGovernanceMemberDto,
  type UpdateGovernanceCommitteeDto,
  type UpdateGovernanceMemberDto,
} from './dto/governance.dto';
import { GovernanceCommitteeEntity } from './entities/governance-committee.entity';
import { GovernanceMemberEntity } from './entities/governance-member.entity';

export interface GovernanceResponse {
  committee: GovernanceCommitteeEntity | null;
  members: GovernanceMemberEntity[];
}

@Injectable()
export class GovernanceService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(GovernanceCommitteeEntity)
    private readonly committeesRepository: Repository<GovernanceCommitteeEntity>,
    @InjectRepository(GovernanceMemberEntity)
    private readonly membersRepository: Repository<GovernanceMemberEntity>,
  ) {}

  async getSection(projectId: string): Promise<GovernanceResponse> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const committee = await this.committeesRepository.findOne({
      where: { sgsiScopeId },
    });
    const members = committee
      ? await this.membersRepository.find({
          where: { governanceCommitteeId: committee.id },
          order: { createdAt: 'ASC' },
        })
      : [];

    return { committee: committee ?? null, members };
  }

  async updateCommittee(
    projectId: string,
    dto: UpdateGovernanceCommitteeDto,
  ): Promise<GovernanceCommitteeEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const existing = await this.committeesRepository.findOne({
      where: { sgsiScopeId },
    });

    if (existing) {
      Object.assign(existing, dto);

      return this.committeesRepository.save(existing);
    }

    return this.committeesRepository.save(
      this.committeesRepository.create({ ...dto, sgsiScopeId }),
    );
  }

  async createMember(
    projectId: string,
    dto: CreateGovernanceMemberDto,
  ): Promise<GovernanceMemberEntity> {
    const committee = await this.getOrCreateCommittee(projectId);

    return this.membersRepository.save(
      this.membersRepository.create({
        ...dto,
        governanceCommitteeId: committee.id,
      }),
    );
  }

  async updateMember(
    projectId: string,
    memberId: string,
    dto: UpdateGovernanceMemberDto,
  ): Promise<GovernanceMemberEntity> {
    const member = await this.findMember(projectId, memberId);

    Object.assign(member, dto);

    return this.membersRepository.save(member);
  }

  async removeMember(projectId: string, memberId: string): Promise<void> {
    const member = await this.findMember(projectId, memberId);

    await this.membersRepository.remove(member);
  }

  private async findMember(
    projectId: string,
    memberId: string,
  ): Promise<GovernanceMemberEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const committee = await this.committeesRepository.findOne({
      where: { sgsiScopeId },
    });

    if (!committee) {
      throw new NotFoundException('Governance committee not found.');
    }

    const member = await this.membersRepository.findOne({
      where: { id: memberId, governanceCommitteeId: committee.id },
    });

    if (!member) {
      throw new NotFoundException('Governance member not found.');
    }

    return member;
  }

  private async getOrCreateCommittee(
    projectId: string,
  ): Promise<GovernanceCommitteeEntity> {
    const sgsiScopeId = await this.resolveSgsiScopeId(projectId);
    const existing = await this.committeesRepository.findOne({
      where: { sgsiScopeId },
    });

    if (existing) {
      return existing;
    }

    return this.committeesRepository.save(
      this.committeesRepository.create({ sgsiScopeId }),
    );
  }

  private async resolveSgsiScopeId(projectId: string): Promise<string> {
    const sgsiScope = await this.sgsiScopesRepository.findOne({
      where: { projectId },
    });

    if (!sgsiScope) {
      throw new NotFoundException(
        'SGSI Scope module has not been activated for this project.',
      );
    }

    return sgsiScope.id;
  }
}
