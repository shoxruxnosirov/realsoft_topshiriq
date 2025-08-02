// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { CreateRoleDto } from "src/modules/roles/dto/create-role.dto";
// import { LoginRoleDto } from "src/modules/roles/dto/login-role.dto";
// import { UpdateRoleDto } from "src/modules/roles/dto/update-role.dto";
// import { Role } from "src/modules/roles/entities/role.entity";
// import { Repository } from "typeorm";

// @Injectable()
// export class RolesRepository {
//     constructor(
//         @InjectRepository(Role)
//         private readonly roleRepository: Repository<Role>,
//     ) {}

//     async create(dto: CreateRoleDto): Promise<Role> {
//         const role = this.roleRepository.create(dto);
//         const results = await this.roleRepository.save(role)
//         return results[0];
//     }

//     async findAll(): Promise<Role[]> {
//         return this.roleRepository.find();
//     }

//     async findOne(id: number): Promise<Role> {
//         const role = await this.roleRepository.findOne({ where: { id } });
//         if (!role) {
//             throw new NotFoundException(`Role with ID ${id} not found`);
//         }
//         return role;
//     }

//     async update(id: number, dto: UpdateRoleDto): Promise<Role> {
//         const role = await this.findOne(id);
//         Object.assign(role, dto);
//         return this.roleRepository.save(role);
//     }

//     async remove(id: number): Promise<void> {
//         const role = await this.findOne(id);
//         await this.roleRepository.remove(role);
//     }

//     async loginRole(roleDto: LoginRoleDto): Promise<Role> {
//         const role = await this.roleRepository.findOne({ where: { username: roleDto.username } });
//         if (!role) {
//             throw new NotFoundException(`Role with username ${roleDto.username} not found`);
//         }
//         return role;
//     }
// }