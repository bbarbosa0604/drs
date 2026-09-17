import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type RequestUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { OrganizationMemberEntity } from './entities/organization-member.entity';
import { OrganizationEntity } from './entities/organization.entity';

/**
 * Existencia sempre vence sobre vinculo: 404 quando a organizacao nao existe,
 * 403 quando existe mas o usuario nao tem vinculo. Padrao adotado porque o
 * caminho inverso (403 generico para tudo) impediria o proprio DSR Admin de
 * distinguir "org inexistente" de "org sem acesso" nos logs de auditoria.
 */
@Injectable()
export class OrganizationsAccessService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationsRepository: Repository<OrganizationEntity>,
    @InjectRepository(OrganizationMemberEntity)
    private readonly organizationMembersRepository: Repository<OrganizationMemberEntity>,
  ) {}

  async assertOrganizationAccess(
    user: RequestUser,
    organizationId: string,
  ): Promise<void> {
    const organization = await this.organizationsRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    if ((user.role as UserRole) === UserRole.ADMIN) {
      return;
    }

    const membership = await this.organizationMembersRepository.findOne({
      where: { organizationId, userId: user.userId },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this organization.',
      );
    }
  }
}
