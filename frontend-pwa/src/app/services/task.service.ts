import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { openDB } from 'idb';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private dbPromise = openDB('tasks-db', 1, {
    upgrade(db) {
      db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
    },
  });

  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  addTaskLocal(task: Task): Observable<any> {
  return from(
    this.dbPromise.then(db => db.add('tasks', task))
  );
}


  getLocalTasks(): Observable<Task[]> {
    return from(this.dbPromise.then(db => db.getAll('tasks')));
  }

  updateLocalTasks(tasks: Task[]): Observable<any> {
    return from(this.dbPromise).pipe(
      switchMap(db =>
        from(db.clear('tasks')).pipe(
          switchMap(() =>
            forkJoin(tasks.map(task => from(db.put('tasks', { ...task, synced: true }))))
          )
        )
      )
    );
  }

  setTaskSynced(id: number): Observable<any> {
    return from(
      this.dbPromise.then(async db => {
        const task = await db.get('tasks', id);
        if (task) {
          task.synced = true;
          task.completed = true;
          await db.put('tasks', task);
        }
      })
    );
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  syncPendingTasks(): Observable<any> {
  // Sincroniza tareas no sincronizadas con el backend
  return from(this.dbPromise).pipe(
    switchMap(db => from(db.getAll('tasks')).pipe(
      map(tasks => tasks.filter((t: Task) => !t.synced)),
      switchMap((unsynced: Task[]) => {
        if (unsynced.length === 0) return of([]);
        // Sincroniza cada tarea pendiente con un POST individual
        return forkJoin(
          unsynced.map(task =>
            this.http.post<Task>(this.apiUrl, {
              title: task.title,
              completed: true
            }).pipe(
              switchMap(() => this.setTaskSynced(task.id!))
            )
          )
        );
      })
    ))
  );
}

deleteLocalTask(id: number): Observable<any> {
  return from(this.dbPromise.then(db => db.delete('tasks', id)));
}

}
