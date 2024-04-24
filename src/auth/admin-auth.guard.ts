import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    super.canActivate(context); // Вызов JwtAuthGuard для базовой проверки JWT
    const request = context.switchToHttp().getRequest();
    return request.user.roles.includes('admin');
  }
}
