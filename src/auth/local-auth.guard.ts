import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  //   canActivate(context: ExecutionContext) {
  //     // Add your JWT authentication logic here
  //     // For example, you can extract the JWT token from the request headers
  //     const request = context.switchToHttp().getRequest();
  //     const token = request.headers.authorization?.split(' ')[1];
  //     // Validate the JWT token and perform any necessary checks
  //     if (!token || !this.validateToken(token)) {
  //       throw new UnauthorizedException('Invalid token');
  //     }
  //     return super.canActivate(context);
  //   }
  //   private validateToken(token: string): boolean {
  //     // Implement your JWT token validation logic here
  //     // For example, you can use a library like jsonwebtoken to verify the token
  //     // Return true if the token is valid, otherwise return false
  //     // You can also perform additional checks like checking the token expiration date, etc.
  //     // Here's an example using the jsonwebtoken library:
  //     const secret = process.env.JWT_SECRET;
  //     try {
  //       jwt.verify(token, secret);
  //       return true;
  //     } catch (error) {
  //       return false;
  //     }
  //     return true; // Replace this with your actual token validation logic
  //   }
}
