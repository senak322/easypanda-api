import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
// import { User } from '../users/user.entity';

interface IUserSafeData {
  userId: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<IUserSafeData | null> {
    try {
      const user = await this.usersService.findOne(username);
      if (user && bcrypt.compareSync(pass, user.password)) {
        const { ...result } = user.toJSON();
        return { userId: result._id.toString(), username: result.username };
      }
    } catch (error) {
      // Логирование ошибки или отправка специфичного сообщения
      console.error('Ошибка при аутентификации', error);
    }
    return null;
  }

  async login(user: IUserSafeData): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
