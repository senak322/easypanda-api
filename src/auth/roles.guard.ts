import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
// import { Role } from 'src/common/roles.enum';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    // console.log('User roles:', request.user?.role);
    // console.log('Required roles:', requiredRoles);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const userHasRole = requiredRoles.some((role) =>
      request.user?.role?.includes(role),
    );
    // console.log('User has required role:', userHasRole);
    return userHasRole;
  }
}
