import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.username);
    console.log(`Это payload sub ${payload.username}`);

    console.log(`Это юзер ${user}`);

    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    };
  }
}
