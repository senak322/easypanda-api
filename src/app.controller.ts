import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './auth/roles.guard';
// import { Roles } from './auth/roles.decorator';
// import { Role } from './common/roles.enum';
import { AdminGuard } from './auth/admin-auth.guard';

@Controller()
@UseGuards(RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(AdminGuard)
  @Get('admin/dashboard')
  getAdminDashboard() {
    return { message: 'Доступ к данным администратора' };
  }
}
