import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, UseGuards, Req, Query, ParseIntPipe, Patch } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesGuard } from 'src/comman/guards/roles.guard';
import { UserRole, Tokens, GuardRequest, PaginatedResponse } from 'src/comman/types';
import { Roles } from 'src/comman/decorators/roles.decorator';
import { LoginRoleDto } from './dto/login-role.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesGuardForRefreshToken } from 'src/comman/guards/refresh-token';
import { Role } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post('login')
  @ApiOperation({ summary: 'login admin or user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { default: 'admin', type: 'string', description: 'admin username' },
        password: { default: 'admin', type: 'string', description: 'admin password' },
      },
      required: ['username', 'password'],
    },
  })
  async loginAdmin(@Body() loginRoleDto: LoginRoleDto): Promise<Tokens> {
    return this.rolesService.login(loginRoleDto);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a user by admin' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: { default: 'user', type: 'string', description: 'new user role' },
        name: { default: 'user_123', type: 'string', description: 'new user name' },
        username: { default: 'new_user', type: 'string', description: 'new user username' },
        password: { default: 'New_user_pass_123', type: 'string', description: 'new admin password' },
      },
      required: ['username', 'password'],
    },
  })
  create(@Body() dto: CreateRoleDto, @Req() req: GuardRequest): Promise<Omit<Role, "password">> {
    return this.rolesService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (roles) (admin only)' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'page number (default: 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
    description: 'page size (default: 4)',
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 4,
  ): Promise<PaginatedResponse<Omit<Role, "password">>> {
    return this.rolesService.findAll(Number(page), Number(pageSize));
  }

  @Get('search')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'search users (roles) (admin only)' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search query (e.g., user)',
    example: 'us er',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'page number (default: 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
    description: 'Page size (default: 4)',
  })
  async search2(
    @Query('search') search: string = '',
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 4,
  ): Promise<PaginatedResponse<Omit<Role, "password">>> {
    return this.rolesService.searchWithSubQuery(search, Number(page), Number(pageSize));
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a user (role) by ID (Admin only)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'User ID', type: 'number', example: 2 })

  findOne(@Param('id', ParseIntPipe) id: number): Promise<Omit<Role, "password">> {
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an user (role) by ID (admin only)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: { default: 'user', type: 'string', description: 'new user role' },
        name: { default: 'user_123', type: 'string', description: 'new user name' },
        username: { default: 'new_user', type: 'string', description: 'new user username' },
        password: { default: 'New_user_pass_123', type: 'string', description: 'new admin password' },
      }
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto, @Req() req: GuardRequest) {
    return this.rolesService.update(id, dto, req.user.id);
  }

  @Patch('me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Update own profile' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { default: 'user_123', type: 'string', description: 'new user name' },
        username: { default: 'new_user', type: 'string', description: 'new user username' },
        password: { default: 'New_user_pass_123', type: 'string', description: 'new admin password' },
      }
    },
  })
  updateOwnProfile(@Body() dto: UpdateRoleDto, @Req() req: GuardRequest) {
    return this.rolesService.updateOwnProfile(req.user.id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an user by ID (admin only)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number', example: 1 })
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.rolesService.remove(+id);
  }

  @Post('refreshtoken')
  @UseGuards(RolesGuardForRefreshToken)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'refresh token with refresh_token' })
  @ApiBearerAuth()
  refreshToken(@Req() req: GuardRequest): Tokens {
    return this.rolesService.refreshTokens(req.user);
  }

}