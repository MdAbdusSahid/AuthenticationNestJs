import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UseGuards, HttpStatus, BadRequestException, InternalServerErrorException, HttpCode, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';



@Controller('user')
@ApiTags("User")
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post('/signup')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      const message = await this.userService.create(createUserDto);
      return { message, statusCode: HttpStatus.CREATED };
    } catch (error) {
      throw new BadRequestException({ message: `Failed to create user: ${error.message}`, statusCode: HttpStatus.BAD_REQUEST });
    }
  }

  @Get()
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  async findAll(@Req() req) {
    console.log(req.user)
    try {
      const message = await this.userService.findAll();
      return { message, statusCode: HttpStatus.OK }
    }
    catch (error) {
      throw new InternalServerErrorException(
        {
          message: `Failed to retrieve users: ${error.message}`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        });
    }
  }
  // @Get()
  // @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  // findAll(@Req() req) {
  //   console.log(req.user)
  //   return this.userService.findAll();
  // }

  @Get(':email')
  @ApiSecurity("JWT-AUTH")
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  async findByEmail(@Param('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (user) {
        return { user, message: 'User found', statusCode: HttpStatus.OK };
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: error.message, statusCode: HttpStatus.NOT_FOUND };
      } else {
        throw new InternalServerErrorException({ message: `Failed to find user: ${error.message}`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR });
      }
    }
  }
  @Delete(':id')
  @ApiSecurity("JWT-AUTH")
  async remove(@Param('id') id: string, @Req() req) {
    const currentUser = req.user;
    const currentDate = new Date();
    const currentUserName = ` ${currentUser.email} who's role is ${currentUser.role}`;
    console.log(`User ${currentUserName} is deleting user with id: ${id}`);
    console.log(currentDate)
    try {
      const user = await this.userService.remove(+id);
      if (user !== `User not found with id: ${id}`) {
        return { user, message: 'User found', currentDate, statusCode: HttpStatus.OK };
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: error.message, statusCode: HttpStatus.NOT_FOUND };
      } else {
        throw new InternalServerErrorException({ message: `Failed to find user: ${error.message}`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR });
      }
    }
  }
  // @Delete(':id')
  // @ApiSecurity("JWT-AUTH")
  // remove(@Param('id') id: string, @Req() req) {
  //   console.log(req.user)
  //   return this.userService.remove(+id);
  // }
}
