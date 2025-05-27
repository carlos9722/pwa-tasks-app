import { Injectable, NgZone } from '@angular/core';
import { TaskService } from './task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {
    window.addEventListener('online', () => {
      this.zone.run(() => this.sync());
    });
  }

  sync() {
    this.taskService.syncPendingTasks().subscribe({
      next: () => {
        this.snackBar.open('¡Sincronización exitosa!', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al sincronizar. Intenta nuevamente.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
