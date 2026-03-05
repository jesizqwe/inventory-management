import { Controller, Get, Param, Post, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('users/:id')
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findUserById(id);
  }

  @Post('users/:id/block')
  blockUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.blockUser(id);
  }

  @Post('users/:id/unblock')
  unblockUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.unblockUser(id);
  }

  @Post('users/:id/promote')
  promoteToAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.addToAdminRole(id);
  }

  @Post('users/:id/demote')
  demoteFromAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.removeFromAdminRole(id);
  }

  @Delete('users/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }
}
