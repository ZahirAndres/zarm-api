import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/task`;

  getTasks() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTaskById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createTask(task: any) {
    return this.http.post<any>(this.apiUrl, task);
  }

  updateTask(id: number, task: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
