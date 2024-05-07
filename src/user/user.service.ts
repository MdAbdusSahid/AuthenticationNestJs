import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
  async create(createUserDto: CreateUserDto): Promise<User> {
    let user: User = new User();
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.password = createUserDto.password;
    user.role = Constants.ROLES.NORMAL_ROLE;
    return await this.entityManager.save(user);
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.entityManager.findOneOrFail(User, { where: { id: String(id) } });
  }


  async findAll(): Promise<User[]> {
    return this.entityManager.find(User);
  }

  async findByEmail(email: string) {
    return await this.entityManager.findOne(User, { where: { email: email } });
  }

  // async update(id: number, updateUserDto: UpdateUserDto): Promise<User | undefined> {
  //   const user = await this.entityManager.findOne(User, { where: { id: String(id) } });
  //   if (!user) {
  //     return undefined; // Return undefined if user is not found
  //   }
  //   const updatedUser = this.entityManager.merge(User, user, updateUserDto);
  //   return await this.entityManager.save(updatedUser);
  //}

  async remove(id: number): Promise<User | undefined> {
    const userToDelete = await this.entityManager.findOne(User, { where: { id: String(id) } });
    if (!userToDelete) {
      return undefined;
    }
    await this.entityManager.delete(User, id);
    return userToDelete;
  }

  // async remove(id: number): Promise<void> {
  //   await this.entityManager.delete(User, id);

  // }
}
