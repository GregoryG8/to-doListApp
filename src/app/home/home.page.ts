import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, checkmarkCircle, close, create, trash } from 'ionicons/icons';

import { Category } from '../models/category.model';
import { Task } from '../models/task.model';
import { CategoryService } from '../services/category.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonText,
  ],
})
export class HomePage implements OnInit {
  private static readonly PAGE_SIZE = 10;

  private readonly destroyRef = inject(DestroyRef);
  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(CategoryService);

  tasks: Task[] = [];
  categories: Category[] = [];
  filteredTasks: Task[] = [];

  newTaskTitle = '';
  newTaskCategoryId = '';
  newCategoryName = '';
  selectedCategoryFilter = 'all';
  composerOpen = false;

  visibleActiveCount = HomePage.PAGE_SIZE;
  visibleCompletedCount = HomePage.PAGE_SIZE;

  editingTaskId: string | null = null;
  editingCategoryId: string | null = null;
  editingCategoryName = '';

  constructor() {
    addIcons({ add, checkmarkCircle, close, create, trash });
  }

  ngOnInit(): void {
    this.categoryService.categories$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => {
        this.categories = categories;
        if (!this.newTaskCategoryId && categories.length > 0) {
          this.newTaskCategoryId = categories[0].id;
        }
        this.applyFilter();
      });

    this.taskService.tasks$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tasks) => {
        this.tasks = tasks;
        this.applyFilter();
      });
  }

  saveTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title || !this.newTaskCategoryId) {
      return;
    }

    const payload = {
      title,
      categoryId: this.newTaskCategoryId,
    };

    if (this.editingTaskId) {
      this.taskService.updateTask(this.editingTaskId, payload);
    } else {
      this.taskService.addTask(payload);
    }

    this.resetTaskComposer();
  }

  toggleTask(task: Task): void {
    this.taskService.toggleTask(task.id);
  }

  removeTask(taskId: string): void {
    this.taskService.removeTask(taskId);

    if (this.editingTaskId === taskId) {
      this.resetTaskComposer();
    }
  }

  editTask(task: Task): void {
    this.editingTaskId = task.id;
    this.newTaskTitle = task.title;
    this.newTaskCategoryId = task.categoryId;
    this.composerOpen = true;
  }

  addCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) {
      return;
    }

    this.categoryService.addCategory(name);
    this.newCategoryName = '';
  }

  startEditCategory(category: Category): void {
    this.editingCategoryId = category.id;
    this.editingCategoryName = category.name;
  }

  saveCategory(): void {
    const name = this.editingCategoryName.trim();
    if (!this.editingCategoryId || !name) {
      return;
    }

    this.categoryService.updateCategory(this.editingCategoryId, name);
    this.editingCategoryId = null;
    this.editingCategoryName = '';
  }

  cancelEditCategory(): void {
    this.editingCategoryId = null;
    this.editingCategoryName = '';
  }

  removeCategory(categoryId: string): void {
    this.categoryService.removeCategory(categoryId);
    this.taskService.clearCategoryFromTasks(categoryId);

    if (this.newTaskCategoryId === categoryId) {
      this.newTaskCategoryId = this.categories[0]?.id ?? '';
    }

    if (this.selectedCategoryFilter === categoryId) {
      this.selectedCategoryFilter = 'all';
    }
  }

  onCategoryFilterChange(): void {
    this.applyFilter();
  }

  setCategoryFilter(filter: string): void {
    this.selectedCategoryFilter = filter;
    this.applyFilter();
  }

  loadMoreActiveTasks(): void {
    this.visibleActiveCount += HomePage.PAGE_SIZE;
  }

  loadMoreCompletedTasks(): void {
    this.visibleCompletedCount += HomePage.PAGE_SIZE;
  }

  toggleComposer(): void {
    this.composerOpen = !this.composerOpen;

    if (!this.composerOpen) {
      this.resetTaskComposer();
    }
  }

  closeComposer(): void {
    this.composerOpen = false;
    this.resetTaskComposer();
    this.editingCategoryId = null;
    this.editingCategoryName = '';
  }

  cancelTaskEdit(): void {
    this.resetTaskComposer();
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  getCategoryName(categoryId: string): string {
    return (
      this.categories.find((category) => category.id === categoryId)?.name ??
      'Sin categoría'
    );
  }

  get activeTasks(): Task[] {
    return this.filteredTasks.filter((task) => !task.completed);
  }

  get visibleActiveTasks(): Task[] {
    return this.activeTasks.slice(0, this.visibleActiveCount);
  }

  get hasMoreActiveTasks(): boolean {
    return this.activeTasks.length > this.visibleActiveCount;
  }

  get completedTasks(): Task[] {
    return this.filteredTasks.filter((task) => task.completed);
  }

  get visibleCompletedTasks(): Task[] {
    return this.completedTasks.slice(0, this.visibleCompletedCount);
  }

  get hasMoreCompletedTasks(): boolean {
    return this.completedTasks.length > this.visibleCompletedCount;
  }

  get todayLabel(): string {
    const now = new Date();
    return now.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
  }

  getCategoryPillClass(categoryId: string): string {
    const colorMap: Record<string, string> = {
      general: 'pill-blue',
      trabajo: 'pill-indigo',
      casa: 'pill-coral',
      personal: 'pill-green',
    };

    const key = this.getCategoryName(categoryId).toLowerCase();
    return colorMap[key] ?? 'pill-slate';
  }

  private applyFilter(): void {
    if (this.selectedCategoryFilter === 'all') {
      this.filteredTasks = [...this.tasks];
      this.resetVisibleCounters();
      return;
    }

    this.filteredTasks = this.tasks.filter(
      (task) => task.categoryId === this.selectedCategoryFilter,
    );
    this.resetVisibleCounters();
  }

  private resetTaskComposer(): void {
    this.editingTaskId = null;
    this.newTaskTitle = '';
    this.newTaskCategoryId = this.categories[0]?.id ?? '';
    this.composerOpen = false;
  }

  private resetVisibleCounters(): void {
    this.visibleActiveCount = HomePage.PAGE_SIZE;
    this.visibleCompletedCount = HomePage.PAGE_SIZE;
  }
}
