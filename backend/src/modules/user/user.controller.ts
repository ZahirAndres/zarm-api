import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User } from './entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/user')
@ApiTags("User")
export class UserController {
  constructor(
    private readonly userSvc: UserService,
    private readonly utilSvc: UtilService
  ) { }

  @Get()
  @UseGuards(AuthGuard)
  public async getUsers(@Req() request: any): Promise<User[]> {
    const user = request['user']
    return await this.userSvc.getUsers(user.id);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  public async getUserById(@Param("id", ParseIntPipe) id: number): Promise<User> {
    const result = await this.userSvc.getUserById(id);
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
    const encryptedPassword = await this.utilSvc.hash(user.password);
    user.password = encryptedPassword
    user.rol_id = 2;
    const result = await this.userSvc.insertUser(user);
    return result;
  }


  // @Patch("/:id")
  // @UseGuards(AuthGuard)
  // public async updateUser(@Param("id", ParseIntPipe) id: number, @Body() user: UpdateUserDto, @Req() request: any): Promise<User> {
  //   const session = request['user'];
  //   if (session.id !== id)
  //     throw new HttpException('No tienes permiso para modificar este usuario', HttpStatus.FORBIDDEN);

  //   if (user.password) {
  //     user.password = await this.utilSvc.hash(user.password);
  //   }

  //   const result = await this.userSvc.updateUser(id, user);
  //   if (result == undefined)
  //     throw new HttpException(`El usuario con ${id} no existe`, HttpStatus.CONFLICT);
  //   return result;
  // }

  // @Delete(":id")
  // @UseGuards(AuthGuard)
  // public async deleteUser(@Param("id", ParseIntPipe) id: number, @Req() request: any): Promise<boolean> {
  //   const session = request['user'];
  //   if (session.id !== id)
  //     throw new HttpException('No tienes permiso para eliminar este usuario', HttpStatus.FORBIDDEN);

  //   const validate = await this.userSvc.getTaskById(id);
  //   if (validate.length > 0) {
  //     throw new HttpException('El usuario tiene tareas asignadas', HttpStatus.CONFLICT)
  //   }
  //   const result = await this.userSvc.deleteUser(id);
  //   if (!result) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND)
  //   }
  //   return true
  // }


  @Patch("/:id")
  @UseGuards(AuthGuard)
  public async updateUser(@Param("id", ParseIntPipe) id: number, @Body() user: UpdateUserDto, @Req() request: any): Promise<User> {
    const session = request['user'];
    
    if (session.id !== id && session.rol_id !== 1) {
      throw new HttpException('No tienes permiso para modificar este usuario', HttpStatus.FORBIDDEN);
    }

    if (user.password) {
      user.password = await this.utilSvc.hash(user.password);
    }

    const result = await this.userSvc.updateUser(id, user);
    if (result == undefined)
      throw new HttpException(`El usuario con ${id} no existe`, HttpStatus.CONFLICT);
    return result;
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  public async deleteUser(@Param("id", ParseIntPipe) id: number, @Req() request: any): Promise<boolean> {
    const session = request['user'];
    
    if (session.id !== id && session.rol_id !== 1) {
      throw new HttpException('No tienes permiso para eliminar este usuario', HttpStatus.FORBIDDEN);
    }

    const validate = await this.userSvc.getTaskById(id);
    if (validate.length > 0) {
      throw new HttpException('El usuario tiene tareas asignadas', HttpStatus.CONFLICT)
    }
    const result = await this.userSvc.deleteUser(id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return true
  }
}
