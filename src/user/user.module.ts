import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repo/user.repository';

@Module({

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
