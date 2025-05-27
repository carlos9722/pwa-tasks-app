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
    if (navigator.onLine) {
      this.taskService.getTasks().subscribe({
        next: (serverTasks) => {
          this.taskService.getLocalTasks().subscribe({
            next: (localTasks) => {
              // Filtra las pendientes que NO están en el backend por título
              const pendingTasks = localTasks.filter(
                localTask => !localTask.synced &&
                  !serverTasks.some(serverTask => serverTask.title === localTask.title)
              );
              const syncedServerTasks = serverTasks.map(task => ({ ...task, synced: true }));
              this.tasks = [...syncedServerTasks, ...pendingTasks];
              this.taskService.updateLocalTasks(this.tasks).subscribe();
            },
            error: () => {
              this.tasks = serverTasks.map(task => ({ ...task, synced: true }));
              this.taskService.updateLocalTasks(this.tasks).subscribe();
            }
          });
        },
        error: () => {
          this.loadLocalTasks();
        }
      });
    } else {
      this.loadLocalTasks();
    }
  }

  loadLocalTasks() {
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
    if (!navigator.onLine) {
      this.snackBar.open('Sin conexión a Internet. Intenta luego.', 'Cerrar', { duration: 2000 });
      return;
    }
    this.taskService.createTask({ title: task.title, completed: true }).subscribe({
      next: () => {
        this.taskService.setTaskSynced(task.id!).subscribe({
          next: () => {
            this.snackBar.open('¡Tarea sincronizada con éxito!', 'Cerrar', { duration: 2000 });
             this.loadLocalTasks();
          }
        });
      },
      error: () => {
        this.snackBar.open('No se pudo sincronizar la tarea.', 'Cerrar', { duration: 2000 });
      }
    });
  }

  syncAllPendingTasks() {
    if (!navigator.onLine) {
      this.snackBar.open('Sin conexión a Internet. Intenta luego.', 'Cerrar', { duration: 2000 });
      return;
    }
    this.taskService.syncPendingTasks().subscribe({
      next: () => {
        this.snackBar.open('¡Todas las tareas sincronizadas!', 'Cerrar', { duration: 2000 });
        this.loadTasks();
      },
      error: () => {
        this.snackBar.open('Error al sincronizar tareas pendientes.', 'Cerrar', { duration: 2000 });
      }
    });
  }

  hasPendingTasks(): boolean {
    return this.tasks && this.tasks.filter(task => !task.synced).length > 1;
  }

  removePendingTask(task: Task) {
    if (task.synced) return;
    this.taskService.deleteLocalTask(task.id!).subscribe({
      next: () => {
        this.snackBar.open('Tarea pendiente eliminada', 'Cerrar', { duration: 2000 });
        this.loadTasks();
      }
    });
  }
}
