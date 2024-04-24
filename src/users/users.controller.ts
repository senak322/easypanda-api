import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../common/roles.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin) // Ensure that only admins can access the user list
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Post('create-admin')
  @Roles(Role.Admin) // Only admins can create new admins
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }

  //   @Delete(':id')
  //   @Roles(Role.Admin)
  //   @HttpCode(HttpStatus.NO_CONTENT)
  //   deleteUser(@Param('id') id: string) {
  //     return this.usersService.remove(id);
  //   }
}
