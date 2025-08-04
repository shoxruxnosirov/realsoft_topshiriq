import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/comman/guards/roles.guard';
import { Roles } from 'src/comman/decorators/roles.decorator';
import { UserRole, GuardRequest, PaginatedResponse } from 'src/comman/types';
import { Customer } from './entities/customer.entity';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create a new customer (user only)' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateCustomerDto })
  create(@Body() dto: CreateCustomerDto, @Req() req: GuardRequest): Promise<Customer> {
    return this.customersService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get paginated list of customers (user and admin)' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
  ): Promise<PaginatedResponse<Customer>> {
    return this.customersService.findAll(page, pageSize);
  }

  @Get('search')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Search customers by name (user and admin)' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', type: String, required: true, example: 'Ali' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 4 })
  search(
    @Query('search') search: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 4,
  ): Promise<PaginatedResponse<Customer>> {
    return this.customersService.searchWithSubQuery(search, page, pageSize);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get a customer by ID (user and admin)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Update a customer by ID (user only)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number', example: 1 })
  @ApiBody({ type: UpdateCustomerDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerDto,
    @Req() req: GuardRequest,
  ): Promise<Customer> {
    return this.customersService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Delete a customer by ID (user only)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number', example: 1 })
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.customersService.remove(+id);
  }
}
