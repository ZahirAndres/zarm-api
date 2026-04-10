import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { Task } from './entities/task.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from '@prisma/client';

@Controller('api/task')
@UseGuards(AuthGuard)
@ApiTags("Task")
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}

  @Get()
  public async getTasks(@Req() request:any): Promise<Task[]> {
    const user = request['user'] as User
    return await this.taskSvc.getTasks(user.id);
  }

  @Get(":id")
  public async getTaskById(@Param("id", ParseIntPipe) id:number,@Req() request:any): Promise<Task>{
    const user = request['user'] as User
    const result = await this.taskSvc.getTaskById(id, user.id);
    if ( result == undefined )
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND)
    return result;
  }

  @Post()
  @ApiOperation({summary: 'Insert a task in the database'})
  public async insertTask(@Body() task:CreateTaskDto, @Req() request:any): Promise<Task> {
    const user = request['user']
    task.user_id = user.id;
    const result = this.taskSvc.insertTask(task);
    if(result == undefined)
      throw new HttpException(`Error al insertar la tarea`, HttpStatus.INTERNAL_SERVER_ERROR);
    return result;
  }

  @Put("/:id")
  public updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: UpdateTaskDto): Promise<Task> {
    return this.taskSvc.updateTask(id, task);
  }

  @Delete("/:id")
  public deleteTask(@Param("id", ParseIntPipe) id: number): Promise<Task> {
    return this.taskSvc.deleteTask(id);
  }
}
