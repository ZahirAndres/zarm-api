import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
@Injectable({})
export class TaskService {
  private tasks: any[] = [];
  getTasks():any {
    return this.tasks;
  }

  getTaskById(id: number): any{
    var task = this.tasks.find(t => t.id == id);
    return task;
  }

  insertTasks(task: CreateTaskDto): any{
    var id = this.tasks.length + 1;
    var insertedTask = this.tasks.push({
      ...task,
      id,
    })
    //task.id = id;
    return this.tasks[insertedTask-1];
  }

  updateTask(id: number, task: any) {
    const taskUpdate = this.tasks.map(t => {
      if (t.id == id){
        if(task.name) t.name = task.name; 
      }
      return t;
    });
    return taskUpdate;
  }

  deleteTask(id: number) {
    const array = this.tasks.filter(t => t.id != id);
    this.tasks = array;
    return `Task Deleted`
  }
}
