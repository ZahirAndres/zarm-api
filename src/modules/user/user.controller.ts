import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User } from './entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UtilService } from 'src/common/services/util.service';

@Controller('api/user')
@ApiTags("User")
export class UserController {
  constructor(
    private readonly userSvc: UserService,
    private readonly utilSvc: UtilService
  ) { }

  @Get()
  public async getUsers(): Promise<User[]> {
    return await this.userSvc.getUsers();
  }

  @Get(":id")
  public async getUserById(@Param("id", ParseIntPipe) id: number): Promise<User> {
    const result = await this.userSvc.getUserById(id);
    console.log("resuldatos: ", result)
    if (result == undefined)
      //  throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND)
    return result;
  }


  @Post()
  @ApiOperation({ summary: 'Insert a user in the database' })
  public async insertUser(@Body() user: CreateUserDto): Promise<User> {
    const validate = await this.userSvc.getUserByNameUser(user.username);
    if (validate) {
      throw new HttpException('El usuario ya existe', HttpStatus.CONFLICT);
    }
    // Encriptar contraseña
    const encryptedPassword = await this.utilSvc.hashPassword(user.password);
    user.password = encryptedPassword
    
    const result = await this.userSvc.insertUser(user);
    return result;
  }


  @Patch("/:id")
  public async updateUser(@Param("id", ParseIntPipe) id: number, @Body() user: UpdateUserDto): Promise<User> {
    const result = await this.userSvc.updateUser(id, user);
    if (result == undefined)
      throw new HttpException(`El usuario con ${id} no existe`, HttpStatus.CONFLICT);
    return result;
  }

  @Delete(":id")
  public async deleteUser(@Param("id", ParseIntPipe) id: number): Promise<boolean> {

    // FIXME: Verificar si el usuario no tiene tareas
    const validate = await this.userSvc.getTaskById(id);
    if (validate) {
      throw new HttpException('El usuario tiene tareas', HttpStatus.NOT_FOUND)
    }
    const result = await this.userSvc.deleteUser(id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return true
  }
}
