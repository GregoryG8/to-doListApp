import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'todo.categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoriesSubject = new BehaviorSubject<Category[]>(this.loadCategories());
  readonly categories$ = this.categoriesSubject.asObservable();

  constructor(private readonly storageService: StorageService) {}

  addCategory(name: string): void {
    const category: Category = {
      id: this.createId(),
      name,
    };

    this.save([...this.categoriesSubject.value, category]);
  }

  updateCategory(categoryId: string, name: string): void {
    const updatedCategories = this.categoriesSubject.value.map((category) =>
      category.id === categoryId ? { ...category, name } : category,
    );

    this.save(updatedCategories);
  }

  removeCategory(categoryId: string): void {
    const remainingCategories = this.categoriesSubject.value.filter((category) => category.id !== categoryId);
    this.save(remainingCategories);
  }

  private loadCategories(): Category[] {
    const storedCategories = this.storageService.get<Category[]>(STORAGE_KEY, []);
    if (storedCategories.length > 0) {
      return storedCategories;
    }

    return [
      { id: this.createId(), name: 'General' },
      { id: this.createId(), name: 'Trabajo' },
      { id: this.createId(), name: 'Casa' },
    ];
  }

  private save(categories: Category[]): void {
    this.categoriesSubject.next(categories);
    this.storageService.set(STORAGE_KEY, categories);
  }

  private createId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
