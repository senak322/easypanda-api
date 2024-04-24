import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './auth/roles.guard';
// import { Roles } from './auth/roles.decorator';
// import { Role } from './common/roles.enum';
// import { AdminGuard } from './auth/admin-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Roles } from './auth/roles.decorator';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { Role } from './common/roles.enum';

@Controller()
@UseGuards(RolesGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Roles(Role.Admin)
  @Post('admin/add')
  async addAdmin(@Body() createUserDto: CreateUserDto, @Request() req: any) {
    if (req.user.roles.includes('admin')) {
      return this.usersService.createAdmin(createUserDto);
    }
    throw new Error('Only admins can add new admins.');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/dashboard')
  getAdminDashboard() {
    return { message: 'Доступ к данным администратора' };
  }
}
