import { Component, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<void>();
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
    });
  }

 onSubmit() {
  if (this.taskForm.valid) {
    const task = { title: this.taskForm.value.title, completed: true };

    if (navigator.onLine) {
      this.taskService.createTask(task).subscribe({
        next: (res) => {
          this.taskService.addTaskLocal({ ...res,completed: true,  synced: true }).subscribe(() => {
            this.snackBar.open('Tarea guardada en el backend', 'Cerrar', { duration: 2000 });
            this.taskForm.reset();
            this.taskAdded.emit();
          });
        },
        error: () => {
          // Si falla el backend, guarda con synced: false
          this.taskService.addTaskLocal({ ...task, completed: false, synced: false }).subscribe(() => {
            this.snackBar.open('Backend caído. Guardado localmente.', 'Cerrar', { duration: 2000 });
            this.taskForm.reset();
            this.taskAdded.emit();
          });
        }
      });
    } else {
      // Sin conexión: synced false
      this.taskService.addTaskLocal({ ...task,completed: false, synced: false }).subscribe(() => {
        this.snackBar.open('Tarea guardada localmente (offline)', 'Cerrar', { duration: 2000 });
        this.taskForm.reset();
        this.taskAdded.emit();
      });
    }
  }
}

}
