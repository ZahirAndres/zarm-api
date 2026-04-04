import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
}
