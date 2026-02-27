import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { Task } from './entities/task.entity';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('api/task')
@ApiTags("Task")
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}

  @Get()
  public async getTasks(): Promise<Task[]> {
    return await this.taskSvc.getTasks();
  }

  @Get(":id")
  public async getTaskById(@Param("id", ParseIntPipe) id:number): Promise<Task>{
    const result = await this.taskSvc.getTaskById(id);
    console.log("resuldatos: ", result )
    if ( result == undefined )
    //  throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND)
    return result;
  }

  @Post()
  @ApiOperation({summary: 'Insert a task in the database'})
  public async insertTask(@Body() task:CreateTaskDto): Promise<Task> {
    const result = this.taskSvc.insertTask(task);
    if(result == undefined)
      throw new HttpException(`Error al insertar la tarea`, HttpStatus.INTERNAL_SERVER_ERROR);
    return result;
  }

  @Put("/:id")
  public updateTask(@Param("id", ParseIntPipe) id:number, @Body() task:UpdateTaskDto): Promise<Task> {
    return this.taskSvc.updateTask(id,task);
  }

  @Delete(":id")
  public deleteTask(@Param("id", ParseIntPipe) id:number): Promise<boolean> {
    const result = this.taskSvc.deleteTask(id);
    if (!result)
      throw new HttpException("No se puede eliminar la tarea",HttpStatus.NOT_FOUND)
    return result
  }
}
