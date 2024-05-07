import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/signUp')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  findAll(@Req() req) {
    console.log(req.user)
    return this.userService.findAll();
  }

  @Get(':email')
  @ApiSecurity("JWT-AUTH")
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Delete(':id')
  @ApiSecurity("JWT-AUTH")
  remove(@Param('id') id: string, @Req() req) {
    console.log(req.user)
    return this.userService.remove(+id);
  }
}
