import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Constants } from 'src/utils/constants';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }
  async create(createUserDto: CreateUserDto): Promise<string> {
    try {
      let user: User = new User();
      user.email = createUserDto.email;
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.password = createUserDto.password;
      user.role = Constants.ROLES.NORMAL_ROLE;

      await this.entityManager.save(user);

      return 'User created successfully';
    } catch (error) {
      throw new BadRequestException(`Failed to create user: ${error.message}`);
    }
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.entityManager.findOneOrFail(User, { where: { id: String(id) } });
  }


  async findAll(): Promise<{ firstName: string, lastName: string, email: string }[]> {
    try {
      const users = await this.entityManager.find(User, {
        select: ['firstName', 'lastName', 'email'],
      });

      if (!users || users.length === 0) {
        throw new NotFoundException('No users found');
      }

      return users.map(user => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }));
    } catch (error) {
      throw new NotFoundException('Error while fetching users', error.message);
    }
  }
  // async findAll(): Promise<User[]> {
  //   return this.entityManager.find(User);
  // }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.entityManager.findOne(User, { where: { email } });
      if (!user) {
        throw new NotFoundException(`User not found for email: ${email}`);
      }
      return user;
    } catch (error) {
      throw new NotFoundException(`Error while fetching user with email: ${email}`, error.message);
    }
  }


  async remove(id: number): Promise<string> {
    try {
      const userToDelete = await this.entityManager.findOne(User, { where: { id: String(id) } });
      if (!userToDelete) {
        return `User not found with id: ${id}`;
      }
      await this.entityManager.delete(User, id);
      return `User with id ${id} deleted successfully`;
    } catch (error) {
      return `Error deleting user with id ${id}: ${error.message}`;
    }
  }
  // async remove(id: number): Promise<User | undefined> {
  //   const userToDelete = await this.entityManager.findOne(User, { where: { id: String(id) } });
  //   if (!userToDelete) {
  //     return undefined;
  //   }
  //   await this.entityManager.delete(User, id);
  //   return userToDelete;
  // }
}
