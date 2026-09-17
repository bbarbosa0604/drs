import { IsEnum } from 'class-validator';

import { ModuleKey } from '../../../common/enums/module-key.enum';

export class ActivateModuleDto {
  @IsEnum(ModuleKey)
  moduleKey!: ModuleKey;
}
