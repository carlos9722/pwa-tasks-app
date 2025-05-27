import { Component, ViewChild  } from '@angular/core';
import { TaskListComponent } from './components/task-list/task-list.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('taskList') taskListComponent!: TaskListComponent;

  reloadTasks() {
    this.taskListComponent.loadTasks();
  }
}
