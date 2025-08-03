import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Brackets, DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { LoginRoleDto } from './dto/login-role.dto';
import { PaginatedResponse, Payload, Tokens, UserRole } from 'src/comman/types';
import { JWT_EXPIRATION, JWT_SECRET, REFRESH_TOKEN_EXPIRATION, REFRESH_TOKEN_SECRET } from 'src/config/env';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) { }

  async create(dto: CreateRoleDto, createdBy: number): Promise<Omit<Role, "password">> {
    const existing = await this.roleRepository.findOne({
      where: { username: dto.username },
    });

    if (existing) {
      throw new BadRequestException(`Username '${dto.username}' already exists`);
    }

    dto.createdBy = createdBy;
    dto.password = await this.hashPassword(dto.password);

    const role = this.roleRepository.create(dto);
    return this.roleRepository.save(role);
  }

  async findAll(page: number = 1, pageSize: number = 4): Promise<PaginatedResponse<Omit<Role, "password">>> {
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.roleRepository.findAndCount({
      where: { status: true },
      skip,
      take: pageSize,
      order: { id: 'ASC' },
    });

    return {
      data: data.map(role => {
        const { password, ...roleWithoutPassword } = role;
        return roleWithoutPassword;
      }),
      meta: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }

  async search(query: string, page = 1, pageSize = 10): Promise<PaginatedResponse<Omit<Role, "password">>> {
    const skip = (page - 1) * pageSize;
    console.log('query: ', query)

    const [data, total] = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.status = :status', { status: true })
      .andWhere(
        new Brackets((qb) => {
          qb.where('role.name ILIKE :query', { query: `%${query}%` })
            .orWhere('role.username ILIKE :query', { query: `%${query}%` })
        }),
      )
      .skip(skip)
      .take(pageSize)
      .orderBy('role.id', 'ASC')
      .getManyAndCount();

    return {
      data: data.map(role => {
        const { password, ...roleWithoutPassword } = role;
        return roleWithoutPassword;
      }),
      meta: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }

  async searchWithSubQuery(words: string, page: number = 1, pageSize: number = 4): Promise<PaginatedResponse<Omit<Role, "password">>> {
    const wordsSet = Array.from(new Set(words.trim().split(/\s+/)));

    let baseQuery = `SELECT * FROM roles WHERE status = true`;
    for (const word of wordsSet) {
      baseQuery = `
        SELECT * FROM (${baseQuery}) AS sub
        WHERE name ILIKE '%${word}%' OR username ILIKE '%${word}%'
      `;
    }

    const skip = (page - 1) * pageSize;

    const finalQuery = `
      WITH filtered AS (
        ${baseQuery}
      ),
      counted AS (
        SELECT COUNT(*) AS total FROM filtered
      )
      SELECT f.*, c.total
      FROM filtered f
      CROSS JOIN counted c
      ORDER BY f.id ASC
      LIMIT ${pageSize} OFFSET ${skip};
    `;

    const result: (Role & { total: string })[] = await this.dataSource.query(finalQuery);

    const total = result.length > 0 ? parseInt(result[0].total, 10) : 0;

    const data = result.map(({ password, total, ...rest }) => rest);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: number): Promise<Omit<Role, "password">> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    const { password, ...roleWithoutPassword } = role;
    return roleWithoutPassword;
  }

  async update(id: number, dto: UpdateRoleDto, updatedBy: number): Promise<Omit<Role, "password">> {
    
    if(dto.role === UserRole.ADMIN) {
      throw new ForbiddenException('You are not allowed to give this permission');
    }
    
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);

    if(role.role === UserRole.ADMIN) {
      throw new ForbiddenException(`You are not allowed to modify this user's data`);
    }

    if (dto.username && dto.username !== role.username) {
      const existing = await this.roleRepository.findOne({
        where: { username: dto.username },
      });

      if (existing) {
        throw new BadRequestException(`Username "${dto.username}" is already taken`);
      }
    }
    if(dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }

    Object.assign(role, dto);
    role.updatedBy = updatedBy;
    const result = await this.roleRepository.save(role);
    const { password, ...roleWithoutPassword } = result;
    return roleWithoutPassword;
  }

    async updateOwnProfile(id: number, dto: UpdateRoleDto, updatedBy: number): Promise<Omit<Role, "password">> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);

    if (dto.username && dto.username !== role.username) {
      const existing = await this.roleRepository.findOne({
        where: { username: dto.username },
      });

      if (existing) {
        throw new BadRequestException(`Username "${dto.username}" is already taken`);
      }
    }
    
    if(dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }

    Object.assign(role, dto);
    role.updatedBy = updatedBy;
    const result = await this.roleRepository.save(role);
    const { password, ...roleWithoutPassword } = result;
    return roleWithoutPassword;
  }

  async remove(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);

    // await this.roleRepository.remove(role);
    role.status = false;
    await this.roleRepository.save(role);
  }

  async login(roleDto: LoginRoleDto): Promise<Tokens> {
    const role = await this.roleRepository.findOne({
      where: { username: roleDto.username },
    });

    if (!role) {
      throw new NotFoundException(`Invalid username or password`);
    }

    const isPasswordValid = await this.comparePassword(roleDto.password, role.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Invalid username or password password incorrect',
      });
    }

    const payload: Payload = { id: role.id, role: role.role };

    return {
      accessToken: this.createAccessToken(payload),
      refreshToken: this.createRefreshToken(payload),
    };
  }

  refreshTokens(payload: Payload): Tokens {
    return {
      accessToken: this.createAccessToken(payload),
      refreshToken: this.createRefreshToken(payload),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  private createAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRATION,
    });
  }

  private createRefreshToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
  }
}
