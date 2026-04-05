import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  // Estado global reactivo para saber si hay usuario logueado
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private router = inject(Router);

  constructor() {
    this.checkToken();
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res.accessToken) {
          localStorage.setItem('access_token', res.accessToken);
          this.checkToken();
        }
      })
    );
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/user`, userData);
  }

  getMe() {
    return this.http.get<any>(`${this.apiUrl}/auth/me`).pipe(
      tap(profile => {
        this.currentUserSubject.next(profile);
      })
    );
  }

  refreshToken() {
    return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, {}).pipe(
      tap(res => {
        if (res.accessToken) {
          localStorage.setItem('access_token', res.accessToken);
          this.checkToken();
        }
      })
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      next: () => this.clearLocalSession(),
      error: () => this.clearLocalSession()
    });
  }

  private clearLocalSession() {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  private checkToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          this.clearLocalSession(); // O aquí podrías intentar el refreshToken
        } else {
          this.currentUserSubject.next(decodedToken);
        }
      } catch (e) {
        this.clearLocalSession();
      }
    }
  }
}
