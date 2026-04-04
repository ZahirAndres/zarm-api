import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
export interface User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  rol_id: number;
}
@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/user`;

  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Petición para actualizar SOLO el rol
  updateUserRole(id: number, rol_id: number) {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, { rol_id });
  }
}
