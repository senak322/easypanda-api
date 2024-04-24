import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.init();
  }

  private async init() {
    const hasAdmin = await this.usersService.hasAdmin();
    const adminPassword = this.configService.get<string>('ADMIN_PAS');

    if (!hasAdmin && adminPassword) {
      await this.usersService.createAdmin({
        username: 'admin',
        password: adminPassword,
        role: 'admin',
      });
    } else if (!adminPassword) {
      console.error('Failed to create admin: ADMIN_PASSWORD is not set');
      throw new Error('ADMIN_PASSWORD is not set');
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}
