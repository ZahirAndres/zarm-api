import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { Task } from './entities/task.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';

@Controller('api/task')
@UseGuards(AuthGuard)
@ApiTags("Task")
export class TaskController {
  constructor(
    private readonly taskSvc: TaskService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  public async getTasks(@Req() request: any): Promise<Task[]> {
    const user = request['user'] as User;
    return await this.taskSvc.getTasks(user.id);
  }

  @Get(":id")
  public async getTaskById(@Param("id", ParseIntPipe) id: number, @Req() request: any): Promise<Task> {
    const user = request['user'] as User;
    const result = await this.taskSvc.getTaskById(id, user.id);
    if (result == undefined)
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    return result;
  }

  @Post()
  @ApiOperation({ summary: 'Insert a task in the database' })
  public async insertTask(@Body() task: CreateTaskDto, @Req() request: any): Promise<Task> {
    const user = request['user'];
    
    // Si no es un Entrenador (Admin), forzamos a que la tarea sea asignada a sí mismo.
    // Si es un Admin, respetamos el user_id asignado en el DTO, o usamos el suyo por defecto.
    if (user.rol_id !== 1) {
      task.user_id = user.id;
    } else if (!task.user_id) {
      task.user_id = user.id;
    }

    const result = await this.taskSvc.insertTask(task);
    if (result == undefined)
      throw new HttpException(`Error al insertar la tarea`, HttpStatus.INTERNAL_SERVER_ERROR);

    // Registrar evento de creación de tarea en la auditoría
    await this.prisma.log.create({
      data: {
        statusCode: HttpStatus.CREATED,
        timestamp: new Date(),
        path: '/api/task',
        error: `Tarea creada: "${task.name}" para el usuario ID: ${task.user_id} (por usuario ID: ${user.id})`,
        errorCode: 'CREATE_TASK',
        session_id: user.id,
      },
    });

    return result;
  }

  @Put("/:id")
  public async updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
    @Req() request: any,
  ): Promise<Task> {
    const session = request['user'];

    // Prevención IDOR: verificar que la tarea pertenece al usuario o es Admin (rol_id=1)
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    if (existing.user_id !== session.id && session.rol_id !== 1) {
      throw new HttpException('No tienes permiso para modificar esta tarea', HttpStatus.FORBIDDEN);
    }

    return this.taskSvc.updateTask(id, task);
  }

  @Delete("/:id")
  public async deleteTask(@Param("id", ParseIntPipe) id: number, @Req() request: any): Promise<Task> {
    const session = request['user'];

    // Prevención IDOR: verificar que la tarea pertenece al usuario o es Admin (rol_id=1)
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    if (existing.user_id !== session.id && session.rol_id !== 1) {
      throw new HttpException('No tienes permiso para eliminar esta tarea', HttpStatus.FORBIDDEN);
    }

    const result = await this.taskSvc.deleteTask(id);

    // Registrar evento de eliminación de tarea en la auditoría
    await this.prisma.log.create({
      data: {
        statusCode: HttpStatus.OK,
        timestamp: new Date(),
        path: `/api/task/${id}`,
        error: `Tarea eliminada: ID ${id} por el usuario ID: ${session.id}`,
        errorCode: 'DELETE_TASK',
        session_id: session.id,
      },
    });

    return result;
  }
}
