import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager, private userService: UserService
  ) { }

  async create(createTodoDto: CreateTodoDto, userId: number) {
    let todo: Todo = new Todo();
    todo.title = createTodoDto.title;
    todo.date = new Date().toLocaleDateString();
    todo.completed = false;
    todo.user = await this.userService.findById(userId)
    return this.entityManager.save(todo);
  }

  async findAllTodoByUserNotCompleted(userId: number): Promise<Todo[]> {
    return await this.entityManager.find(Todo, {
      where: {
        user: { id: String(userId) },
        completed: false,
      },
      relations: ['user'],
    });
  }
  async findAllTodoByUserCompleted(userId: number): Promise<Todo[]> {
    return await this.entityManager.find(Todo, {
      where: {
        user: { id: String(userId) },
        completed: true,
      },
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  async update(id: number): Promise<Todo | undefined> {
    const todo = await this.entityManager.findOne(Todo, { where: { id } });
    if (!todo) {
      return undefined;
    }
    todo.completed = true;
    return await this.entityManager.save(Todo, todo);
  }

  async remove(id: number): Promise<void> {
    await this.entityManager.delete(Todo, id);
  }
}
