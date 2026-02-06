import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('api/task')
export class TaskController {
  constructor(private taskSvc: TaskService) {}

  @Get()
  public getTasks(): any {
    return this.taskSvc.getTasks();
  }

  @Get(":id")
  public getTaskById(@Param("id") id): string {
    return this.taskSvc.getTaskById(parseInt(id));
  }

  @Post()
  public insertTask(@Body() task:any) {
    return this.taskSvc.insertTasks(task);
  }

  @Put(":id")
  public updateTask(@Param("id") id:string, @Body() task:any) {
    return this.taskSvc.updateTask(parseInt(id),task);
  }

  @Delete(":id")
  public deleteTask(@Param("id") id:any) {
    return this.taskSvc.deleteTask(parseInt(id));
  }
}
