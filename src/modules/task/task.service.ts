import { Injectable } from '@nestjs/common';
const tareas = [{ nombre: 'Tarea 1', descripcion: 'lorem20' },{ nombre: 'Tarea 2', descripcion: 'lorem20' }];
@Injectable({})
export class TaskService {
  getTasks() {
    return tareas;
  }
}
