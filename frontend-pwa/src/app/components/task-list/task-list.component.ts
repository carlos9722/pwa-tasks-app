import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getLocalTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: () => {
        this.snackBar.open('Error al cargar tareas locales', 'Cerrar', { duration: 3000 });
      }
    });
  }

  syncTask(task: Task) {
    // Solo intenta sincronizar si hay conexión
    if (!navigator.onLine) {
      this.snackBar.open('Sin conexión a Internet. Intenta luego.', 'Cerrar', { duration: 2000 });
      return;
    }

    // Envia SOLO esta tarea al backend
    this.taskService.createTask(task).subscribe({
      next: (res) => {
        // Marca la tarea como sincronizada localmente
        this.taskService.setTaskSynced(task.id!).subscribe({
          next: () => {
            this.snackBar.open('¡Tarea sincronizada con éxito!', 'Cerrar', { duration: 2000 });
            this.loadTasks();
          }
        });
      },
      error: () => {
        this.snackBar.open('No se pudo sincronizar la tarea.', 'Cerrar', { duration: 2000 });
      }
    });
  }
}
