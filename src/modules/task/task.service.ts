import { Injectable } from '@nestjs/common';
const tasks = [{ nombre: 'Tarea 1', descripcion: 'lorem20' },{ nombre: 'Tarea 2', descripcion: 'lorem20' }];
@Injectable({})
export class TaskService {
  getTasks() {
    return tasks;
  }

  getTaskById(id: number) {
    return `Tarea con el ${id}`;
  }

  insertTasks(task: any): string{
    return task;
  }

  updateTask(id: number, task: any) {
    return task;
  }

  deleteTask(id: number) {
    return `Tarea eliminada id: ${id}`;
  }
}
