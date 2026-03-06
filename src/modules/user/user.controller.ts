import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User } from './entities/user.entity';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('api/user')
@ApiTags("User")
export class UserController {
  constructor(private readonly userSvc: UserService) {}

  @Get()
  public async getTasks(): Promise<User[]> {
    return await this.userSvc.getUsers();
  }

  @Get(":id")
  public async getTaskById(@Param("id", ParseIntPipe) id:number): Promise<User>{
    const result = await this.userSvc.getUserById(id);
    console.log("resuldatos: ", result )
    if ( result == undefined )
    //  throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND)
    return result;
  }

  @Post()
  @ApiOperation({summary: 'Insert a user in the database'})
  public async insertTask(@Body() user:CreateUserDto): Promise<User> {
    const result = this.userSvc.insertUser(user);
    if(result == undefined)
      throw new HttpException(`Error al insertar el usuario`, HttpStatus.INTERNAL_SERVER_ERROR);
    return result;
  }

  @Put("/:id")
  public updateTask(@Param("id", ParseIntPipe) id:number, @Body() user:UpdateUserDto): Promise<User> {
    return this.userSvc.updateUser(id,user);
  }

  @Delete(":id")
  public async deleteTask(@Param("id", ParseIntPipe) id:number): Promise<boolean> {
    try {
      await this.userSvc.deleteUser(id);
    } catch (error) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }
    return true
  }
}
