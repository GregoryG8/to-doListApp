import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'todo.tasks';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly tasksSubject = new BehaviorSubject<Task[]>(this.loadTasks());
  readonly tasks$ = this.tasksSubject.asObservable();

  constructor(private readonly storageService: StorageService) {}

  addTask(data: Pick<Task, 'title' | 'categoryId'>): void {
    const task: Task = {
      id: this.createId(),
      title: data.title,
      categoryId: data.categoryId,
      completed: false,
      createdAt: Date.now(),
    };

    this.save([task, ...this.tasksSubject.value]);
  }

  toggleTask(taskId: string): void {
    const updatedTasks = this.tasksSubject.value.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );

    this.save(updatedTasks);
  }

  removeTask(taskId: string): void {
    const remainingTasks = this.tasksSubject.value.filter((task) => task.id !== taskId);
    this.save(remainingTasks);
  }

  clearCategoryFromTasks(categoryId: string): void {
    const updatedTasks = this.tasksSubject.value.map((task) =>
      task.categoryId === categoryId ? { ...task, categoryId: '' } : task,
    );

    this.save(updatedTasks);
  }

  private loadTasks(): Task[] {
    return this.storageService.get<Task[]>(STORAGE_KEY, []);
  }

  private save(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
    this.storageService.set(STORAGE_KEY, tasks);
  }

  private createId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
