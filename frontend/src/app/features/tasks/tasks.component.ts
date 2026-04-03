import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  ejerciciosDemo = [
    { id: 1, nombre: 'Tiros de 3 puntos', descripcion: 'Serie de 50 tiros desde la línea de 3. Énfasis en postura y rotación de muñeca.', prioridad: true },
    { id: 2, nombre: 'Dribling entre conos', descripcion: 'Zigzag con balón dominante y no dominante. 5 series de ida y vuelta a máxima velocidad.', prioridad: false },
    { id: 3, nombre: 'Defensa 1 vs 1', descripcion: 'Trabajo defensivo individual. Posición baja, brazos activos, desplazamiento lateral sin cruzar pies.', prioridad: true },
    { id: 4, nombre: 'Resistencia / Suicidios', descripcion: 'Sprints de línea a línea con toque al piso. Trabajo cardiovascular.', prioridad: false },
  ];
}
