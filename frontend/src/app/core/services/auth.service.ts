import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  // Estado global reactivo para saber si hay usuario logueado
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        // En la fase 4 procesaremos el accessToken a fondo
        this.currentUserSubject.next({ username: credentials.username });
      })
    );
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/user`, userData);
  }

  logout() {
    this.currentUserSubject.next(null);
  }
}
