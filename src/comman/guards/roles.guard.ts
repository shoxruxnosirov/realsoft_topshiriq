import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config/env';
import { GuardRequest, Payload, UserRole } from '../types';
import { RolesService } from 'src/modules/roles/roles.service';
// import { RolesRepository } from 'src/repositories/roles.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    // private readonly rolesRepository: RolesRepository,
    private readonly rolesService: RolesService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<GuardRequest>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decoded: Payload = this.jwtService.verify(token, { secret: JWT_SECRET });
      const userRole: UserRole = decoded.role;

      if (userRole === UserRole.USER) {
        try {
          await this.rolesService.findOne(+decoded.id);
        } catch (err: unknown) {
          if (err instanceof Error) {
            throw new ForbiddenException('You do not have permission to access this resource');
          } else {
            throw err;
          }
        }
      }

      const payload: Payload = {
        id: decoded.id,
        role: decoded.role,
      };
      request.user = payload;

      if (!roles.includes(userRole)) {
        throw new ForbiddenException("You do not have permission to access this resource");
      }
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err instanceof ForbiddenException) {
          throw err;
        } else {
          throw new UnauthorizedException('Invalid token');
        }
      } else {
        throw err;
      }
    }
  }
}
