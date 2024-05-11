import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, NotFoundException, HttpStatus, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('todo')
@ApiTags("Todo")
@ApiSecurity("JWT-AUTH")
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post(':userid')
  async create(@Body(ValidationPipe) createTodoDto: CreateTodoDto, @Param('userid') userid: number) {
    try {
      const result = await this.todoService.create(createTodoDto, userid);
      if (!result) {
        throw new NotFoundException('User not found');
      }
      return { message: 'Todo created successfully', statusCode: HttpStatus.CREATED };
    } catch (error) {
      throw new InternalServerErrorException(
        {
          message: `Failed to create : ${error.message}`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        });
    }
  }

  // @Post(':userId')
  // create(@Body(ValidationPipe) createTodoDto: CreateTodoDto, @Param("userId") userId: number) {
  //   return this.todoService.create(createTodoDto, userId);
  // }


  @Get('/findallnotcompleted/:userid')
  async findAllTodosByuseridNotComplited(@Param('userid') userid: number) {
    try {
      const result = await this.todoService.findAllTodoByUserNotCompleted(Number(userid));
      if (!result) {
        return { message: 'Todos not found', statusCode: HttpStatus.NOT_FOUND };
      }
      return { message: 'Todos retrieved successfully', statusCode: HttpStatus.OK, data: result };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: error.message, statusCode: HttpStatus.NOT_FOUND };
      } else {
        throw new InternalServerErrorException(
          {
            message: `Failed to find todos: ${error.message}`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR
          });
      }
    }
  }
  // @Get('/findallnotcompleted/:userId')
  // findAllTodosByUserIdNotComplited(@Param("userId") userId: number) {
  //   return this.todoService.findAllTodoByUserNotCompleted(Number(userId));
  // }


  @Get('/findallcompleted/:userid')
  async findAllTodosByuseridComplited(@Param('userid') userid: number) {
    try {
      const result = await this.todoService.findAllTodoByUserCompleted(Number(userid));
      if (!result) {
        return { message: 'Todos not found', statusCode: HttpStatus.NOT_FOUND };
      }
      return { message: 'Todos retrieved successfully', statusCode: HttpStatus.OK, data: result };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: error.message, statusCode: HttpStatus.NOT_FOUND };
      } else {
        throw new InternalServerErrorException(
          {
            message: `Failed to find todos: ${error.message}`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR
          });
      }
    }
  }
  // @Get('/findallcompleted/:userId')
  // findAllTodosByUserIdComplited(@Param("userId") userId: number) {
  //   return this.todoService.findAllTodoByUserCompleted(Number(userId));
  // }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.todoService.findOne(+id);
      if (!result) {
        throw new NotFoundException('Todo not found');
      }
      return { message: 'Todo retrieved successfully', statusCode: HttpStatus.OK, data: result };
    } catch (error) {
      throw new InternalServerErrorException(
        {
          message: `Failed to find : ${error.message}`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        });
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.todoService.findOne(+id);
  // }

  @Patch(':id')
  async update(@Param('id') id: string) {
    try {
      const result = await this.todoService.update(Number(id));
      if (!result) {
        return { message: `Todo not found with id ${id}`, statusCode: HttpStatus.NOT_FOUND };
      }
      console.log(result)
      return {
        message: 'Todo updated successfully', statusCode: HttpStatus.OK, data: result
      };
    } catch (error) {
      throw new InternalServerErrorException(
        {
          message: `${error.message}`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        });
    }
  }
  // @Patch(':id')
  // update(@Param('id', ParseIntPipe) id: number) {
  //   return this.todoService.update(id);
  // }
  @Delete(':id') async remove(@Param('id') id: string) {
    try {
      const result = await this.todoService.remove(id);
      console.log('Result:', result);
      const currentDate = new Date();
      if (result !== `Todo not found with id: ${id}`) {
        return { currentDate, statusCode: HttpStatus.OK };
      }
      else {
        return { message: `Todo not found with id ${id}`, statusCode: HttpStatus.NOT_FOUND };
      }
    } catch (error) {
      throw new InternalServerErrorException(
        {
          message: `Failed to find : ${error.message}`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        });
    }
  }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.todoService.remove(Number(id));
  // }
}
