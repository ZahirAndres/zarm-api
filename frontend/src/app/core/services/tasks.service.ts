import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: boolean;
  created_at: string;
  user_id: number;
}

export interface CreateTaskDto {
  name: string;
  description: string;
  priority: boolean;
  user_id: number;
}

export interface UpdateTaskDto {
  name: string;
  description: string;
  priority: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/task`;

  getTasks() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: number) {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: CreateTaskDto) {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Partial<UpdateTaskDto>) {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}