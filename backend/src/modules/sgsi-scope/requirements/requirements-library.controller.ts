import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRole } from '../../users/entities/user.entity';
import {
  CreateRequirementDto,
  UpdateRequirementDto,
} from './dto/requirement-library.dto';
import { RequirementsLibraryService } from './requirements-library.service';

/**
 * Biblioteca global — leitura para qualquer usuario autenticado, escrita
 * restrita a DSR Admin (mesmo padrao de `UsersController`, Task 003).
 */
@UseGuards(JwtAuthGuard)
@Controller('requirements')
export class RequirementsLibraryController {
  constructor(
    private readonly requirementsLibraryService: RequirementsLibraryService,
  ) {}

  @Get()
  list() {
    return this.requirementsLibraryService.list();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateRequirementDto) {
    return this.requirementsLibraryService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateRequirementDto,
  ) {
    return this.requirementsLibraryService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.requirementsLibraryService.remove(id);
  }
}
