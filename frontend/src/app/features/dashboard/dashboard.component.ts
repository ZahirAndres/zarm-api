import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router'; // Para los botones de navegación
import { AuthService } from '../../core/services/auth.service';
import { PlayersService, User } from '../../core/services/players.service';
import { TasksService, Task } from '../../core/services/tasks.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, RouterLink], // Importante para usar routerLink
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  playersService = inject(PlayersService);
  tasksService = inject(TasksService);

  users = signal<User[]>([]);
  tasks = signal<Task[]>([]);

  ngOnInit() {
    this.playersService.getUsers().subscribe(data => this.users.set(data));
    this.tasksService.getTasks().subscribe(data => this.tasks.set(data));
  }

  totalPlayers = computed(() => this.users().filter(u => u.rol_id === 2).length);
  
  totalTasks = computed(() => this.tasks().length);
  
  highPriorityTasks = computed(() => this.tasks().filter(t => t.priority).length);
}