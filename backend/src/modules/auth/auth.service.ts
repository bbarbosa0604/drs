import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: LoginDto) {
    const user = await this.usersService.validateCredentials(
      dto.email,
      dto.password,
    );
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.usersService.toPublicUser(user),
    };
  }

  /**
   * `GET /auth/me` deve devolver o mesmo formato `PublicUser` de
   * `POST /auth/login` (contrato `#/components/schemas/User`, com `id`) —
   * nao o `RequestUser` interno (com `userId`) usado por guards/decorators
   * via `buildRequestUser`. Bug real: antes retornava `RequestUser`, o que
   * deixava `user.id` `undefined` no frontend (ver `getCurrentUser` em
   * `next-js/src/services/auth/auth.service.ts`) em toda pagina que usa o
   * usuario atual como `responsibleUserId`/`preparedByUserId` etc.
   */
  getProfile(userId: string) {
    return this.usersService.findOne(userId);
  }
}
