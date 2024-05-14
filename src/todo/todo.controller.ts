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


  @Patch(':id')
  async update(@Param('id') id: number) {
    try {
      const result = await this.todoService.update(id);
      if (!result) {
        throw new NotFoundException(`Todo not found with id ${id}`);
      }
      console.log(result)
      return {
        message: 'Todo updated successfully',
        statusCode: HttpStatus.OK,
        data: result
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          message: `Failed to update todo: ${error.message}`,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        });
      }
    }
  }


  @Delete(':id') async remove(@Param('id') id: string) {
    try {
      const result = await this.todoService.remove(id);
      console.log('Result:', result);
      const currentDate = new Date();
      if (result !== `Todo not found with id: ${id}`) {
        return { message: `Todo with id ${id} deleted successfully`, currentDate, statusCode: HttpStatus.OK };
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

}
