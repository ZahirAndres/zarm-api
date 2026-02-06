import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('api/task')
export class TaskController {
  constructor(private taskSvc: TaskService) {}

  @Get()
  public login(): any {
    return this.taskSvc.getTasks();
  }
}
