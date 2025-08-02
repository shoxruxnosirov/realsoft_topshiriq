// import { PartialType } from '@nestjs/mapped-types';
// import { CreateRoleDto } from './create-role.dto';

// export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
import { Role } from "../entities/role.entity";

export class UpdateRoleDto {
  role?: Role;
  name?: string;
  username?: string;
  status?: boolean;
  updatedBy?: number;
}
