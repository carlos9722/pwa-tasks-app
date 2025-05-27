import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create(createTaskDto);
    return this.taskRepo.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepo.find();
  }

  async bulkUpsert(tasks: CreateTaskDto[]): Promise<Task[]> {
    const results = [];
    for (const t of tasks) {
      const task = this.taskRepo.create(t);
      results.push(await this.taskRepo.save(task));
    }
    return results;
  }
}
