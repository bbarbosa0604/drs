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

import {
  CurrentUser,
  type RequestUser,
} from '../../common/decorators/current-user.decorator';
import { OrganizationAccessGuard } from '../../common/guards/organization-access.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationInputDto } from './dto/organization-input.dto';
import { OrganizationsService } from './organizations.service';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.organizationsService.findAllForUser(user);
  }

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: OrganizationInputDto) {
    return this.organizationsService.create(user, dto);
  }

  @UseGuards(OrganizationAccessGuard)
  @Get(':organizationId')
  findOne(@Param('organizationId', new ParseUUIDPipe()) id: string) {
    return this.organizationsService.findOne(id);
  }

  @UseGuards(OrganizationAccessGuard)
  @Patch(':organizationId')
  update(
    @Param('organizationId', new ParseUUIDPipe()) id: string,
    @Body() dto: OrganizationInputDto,
  ) {
    return this.organizationsService.update(id, dto);
  }

  @UseGuards(OrganizationAccessGuard)
  @Delete(':organizationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('organizationId', new ParseUUIDPipe()) id: string) {
    await this.organizationsService.remove(id);
  }
}
