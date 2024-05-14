import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
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
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException(`User not found with id: ${userId}`);
      }
      let todo: Todo = new Todo();
      todo.title = createTodoDto.title;
      todo.date = new Date().toLocaleDateString();
      todo.completed = false;
      todo.user = user;
      const savedTodo = await this.entityManager.save(todo);
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        title: todo.title,
        date: todo.date,
        complete: todo.completed
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {

        throw new InternalServerErrorException(`Failed to create todo: ${error.message}`);
      }
    }
  }
  async findAllTodoByUserNotCompleted(userId: number): Promise<{ todoId: number, firstName: string, lastName: string, email: string, title: string, date: string, completed: boolean }[]> {
    try {
      const todos = await this.entityManager.find(Todo, {
        where: {
          user: { id: String(userId) },
          completed: false,
        },
        relations: ['user'],
      });

      if (!todos || todos.length === 0) {
        throw new NotFoundException(`No todos found for user with id: ${userId}`);
      }

      return todos.map(todo => ({
        firstName: todo.user.firstName,
        lastName: todo.user.lastName,
        email: todo.user.email,
        todoId: todo.id,
        title: todo.title,
        date: todo.date,
        completed: todo.completed,
      }));
    } catch (error) {
      throw new NotFoundException(`Failed to find todos for user with id: ${userId}`, error.message);
    }
  }



  async findAllTodoByUserCompleted(userId: number): Promise<{ todoId: number, firstName: string, lastName: string, email: string, title: string, date: string, completed: boolean }[]> {
    try {
      const todos = await this.entityManager.find(Todo, {
        where: {
          user: { id: String(userId) },
          completed: true,
        },
        relations: ['user'],
      });
      if (!todos || todos.length === 0) {
        throw new NotFoundException(`No completed todos found for user with id: ${userId}`);
      }

      return todos.map(todo => ({
        firstName: todo.user.firstName,
        lastName: todo.user.lastName,
        email: todo.user.email,
        todoId: todo.id,
        title: todo.title,
        date: todo.date,
        completed: todo.completed,
      }));
    } catch (error) {
      throw new NotFoundException(`Failed to find completed todos for user with id: ${userId}`, error.message);
    }
  }



  async findOne(id: number): Promise<Todo | undefined> {
    try {
      return await this.entityManager.findOne(Todo, { where: { id } });
    } catch (error) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }

  async update(id: number): Promise<{ title: string, date: string, completed: boolean } | undefined> {
    try {
      const todo = await this.entityManager.findOne(Todo, { where: { id } });
      if (!todo) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }
      todo.completed = true;
      await this.entityManager.save(Todo, todo);
      return {
        title: todo.title,
        date: todo.date,
        completed: todo.completed,
      };
    } catch (error) {
      throw new NotFoundException(`Failed to update todo: ${error.message}`);
    }
  }



  async remove(id: string): Promise<String> {
    try {
      const todoToDelete = await this.entityManager.delete(Todo, id);
      if (!todoToDelete.affected) {
        return `Todo not found with id: ${id}`;
      }
      return Promise.resolve("successfully deleted.");
    } catch (error) {
      throw new NotFoundException(`Todo with ID ${id} not found.`);
    }
  }

}
