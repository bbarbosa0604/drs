import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentGenerationModule } from './modules/document-generation/document-generation.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContextModule } from './modules/sgsi-scope/context/context.module';
import { LimitsModule } from './modules/sgsi-scope/limits/limits.module';
import { RequirementsModule } from './modules/sgsi-scope/requirements/requirements.module';
import { ScopeDefinitionModule } from './modules/sgsi-scope/scope-definition/scope-definition.module';
import { ScopeEngineModule } from './modules/sgsi-scope/scope-engine/scope-engine.module';
import { SgsiScopeModule } from './modules/sgsi-scope/sgsi-scope.module';
import { SgsiScopeVersioningModule } from './modules/sgsi-scope/versioning/sgsi-scope-versioning.module';
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
    ScopeDefinitionModule,
    ScopeEngineModule,
    LimitsModule,
    DocumentGenerationModule,
    AuditLogModule,
    SgsiScopeVersioningModule,
  ],
})
export class AppModule {}
