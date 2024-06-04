import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
// import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest<Request>();
//     const token = request.headers.authorization?.split(' ')[1];
//     if (!token) return false;

//     try {
//       this.jwtService.verify(token);
//       return true;
//     } catch (e) {
//       return false;
//     }
//   }
// }
