import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
@Injectable({})
export class TaskService {

  constructor(@Inject('PG_CONNECTION') private db:any){}

  private tasks: any[] = [];

  async getTasks() {
    const query = 'SELECT * FROM tasks';
    const result = await this.db.query(query);
    return result.rows;
  }

  async getTaskById(id: number): Promise<any>{
    const query = 'SELECT * FROM tasks';
    const result = await this.db.query(query);
    return result.rows[0];
  }

  insertTasks(task: CreateTaskDto): CreateTaskDto{
    const id = this.tasks.length + 1;
    const newTask = {...task, id};
    this.tasks.push(newTask);

    return newTask;
  }

  updateTask(id: number, task: any): any {
    const taskUpdate = this.tasks.map(t => {
      if(t.id === id){
        if(task.name) t.name = task.name;
        if(task.description) t.description = task.description;
        if(task.priority) t.priority = task.priority;

        return t;
      }
      return t;
    });

    return taskUpdate;
  }

  deleteTask(id: number): string {
    const initialLength = this.tasks.length;

    this.tasks = this.tasks.filter(task => task.id !== id);

    if(this.tasks.length < initialLength){
      return "Tarea eliminada correctamente";
    } else {
      return "Tarea no encontrada";
    }
  }
}
