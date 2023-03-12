import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/user.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  // should return boolean value
  constructor(
    private readonly reflecotr: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflecotr.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext(); // convert ExecutrionContext to GqlContext
    const token: User = gqlContext.token;
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.findById(decoded['id']);
        if (!user) {
          return false;
        }
        gqlContext['user'] = user;
        if (roles.includes('Any')) {
          return true;
        }
        return roles.includes(user.role);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
