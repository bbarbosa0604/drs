import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContextModule } from './modules/sgsi-scope/context/context.module';
import { RequirementsModule } from './modules/sgsi-scope/requirements/requirements.module';
import { SgsiScopeModule } from './modules/sgsi-scope/sgsi-scope.module';
import { UsersModule } from './modules/users/users.module';
import { appConfig } from './config/app.config';
import { createTypeOrmOptions, databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig, databaseConfig],
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: createTypeOrmOptions,
    }),
    UsersModule,
    AuthModule,
    OrganizationsModule,
    ProjectsModule,
    SgsiScopeModule,
    ContextModule,
    RequirementsModule,
  ],
})
export class AppModule {}
