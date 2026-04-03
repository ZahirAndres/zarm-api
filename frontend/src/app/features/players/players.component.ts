import { Component } from '@angular/core';

@Component({
  selector: 'app-users-list',
  standalone: true,
  templateUrl: './players.component.html',
  styleUrl: './players.component.css'
})
export class PlayersComponent {
  // Ajustado a lo que responde el Backend Real: username, email y el Rol
  usuariosDemo = [
    { id: 1, username: 'cmendoza', email: 'cmendoza@coachzone.com', rol: 'Entrenador' },
    { id: 2, username: 'lramirez', email: 'lramirez@coachzone.com', rol: 'Jugador' },
    { id: 3, username: 'dtorres', email: 'dtorres@coachzone.com', rol: 'Jugador' },
  ];
}
