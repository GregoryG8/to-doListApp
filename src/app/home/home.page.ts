import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close, create, trash } from 'ionicons/icons';

import { Category } from '../models/category.model';
import { Task } from '../models/task.model';
import { CategoryService } from '../services/category.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCheckbox,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(CategoryService);

  tasks: Task[] = [];
  categories: Category[] = [];
  filteredTasks: Task[] = [];

  newTaskTitle = '';
  newTaskCategoryId = '';
  newCategoryName = '';
  selectedCategoryFilter = 'all';

  editingCategoryId: string | null = null;
  editingCategoryName = '';

  constructor() {
    addIcons({ add, close, create, trash });
  }

  ngOnInit(): void {
    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;
      if (!this.newTaskCategoryId && categories.length > 0) {
        this.newTaskCategoryId = categories[0].id;
      }
      this.applyFilter();
    });

    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  addTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title || !this.newTaskCategoryId) {
      return;
    }

    this.taskService.addTask({
      title,
      categoryId: this.newTaskCategoryId,
    });

    this.newTaskTitle = '';
  }

  toggleTask(task: Task): void {
    this.taskService.toggleTask(task.id);
  }

  removeTask(taskId: string): void {
    this.taskService.removeTask(taskId);
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

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find((category) => category.id === categoryId)?.name ?? 'Sin categoría';
  }

  private applyFilter(): void {
    if (this.selectedCategoryFilter === 'all') {
      this.filteredTasks = [...this.tasks];
      return;
    }

    this.filteredTasks = this.tasks.filter((task) => task.categoryId === this.selectedCategoryFilter);
  }
}
