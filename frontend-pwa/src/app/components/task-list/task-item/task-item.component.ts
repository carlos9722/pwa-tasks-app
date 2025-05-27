import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() sync = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<Task>();

  onSync() {
    this.sync.emit(this.task);
  }

  onRemove() {
    this.remove.emit(this.task);
  }
}
