import { UserRole } from "src/comman/types";

export class CreateRoleDto {
  role: UserRole;
  name: string;
  username: string;
  password: string;
  createdBy?: number;
}
