import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('todo')
@ApiTags("Todo")
@ApiSecurity("JWT-AUTH")
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post(':userId')
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto, @Param("userId") userId: number) {
    return this.todoService.create(createTodoDto, userId);
  }

  @Get('/findAllNotCompleted/:userId')
  findAllTodosByUserIdNotComplited(@Param("userId") userId: number) {
    return this.todoService.findAllTodoByUserNotCompleted(Number(userId));
  }
  @Get('/findAllCompleted/:userId')
  findAllTodosByUserIdComplited(@Param("userId") userId: number) {
    return this.todoService.findAllTodoByUserCompleted(Number(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.todoService.update(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(Number(id));
  }
}
