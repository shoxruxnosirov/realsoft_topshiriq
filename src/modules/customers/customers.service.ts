import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginatedResponse } from 'src/comman/types';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateCustomerDto, createdBy: number): Promise<Customer> {
    const existing = await this.customerRepository.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException(`Customer '${dto.name}' already exists`);
    }

    const customer = this.customerRepository.create({ ...dto, createdBy });
    return await this.customerRepository.save(customer);
  }

  async findAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Customer>> {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.customerRepository.findAndCount({
      skip,
      take: pageSize,
      order: { id: 'ASC' },
    });

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

  async searchWithSubQuery(
    words: string,
    page = 1,
    pageSize = 4,
  ): Promise<PaginatedResponse<Customer>> {
    const wordsSet = Array.from(new Set(words.trim().split(/\s+/)));

    let baseQuery = `SELECT * FROM customers WHERE status = true`;
    for (const word of wordsSet) {
      baseQuery = `
        SELECT * FROM (${baseQuery}) AS sub
        WHERE name ILIKE '%${word}%' 
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

    const result: (Customer & { total: string })[] = await this.dataSource.query(finalQuery);
    const total = result.length > 0 ? parseInt(result[0].total, 10) : 0;
    const data = result.map(({ total, ...rest }) => rest);

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

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);
    return customer;
  }

  async update(id: number, dto: UpdateCustomerDto, updatedBy: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);

    Object.assign(customer, dto);
    customer.updatedBy = updatedBy;

    return await this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);

    customer.status = false;
    await this.customerRepository.save(customer);
  }
}
