import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, ToDoItem } from '../todo.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html'
})
export class TodoListComponent implements OnInit {
  todos: ToDoItem[] = [];
  newTask: string = '';
  errorMessage: string | null = null;
  isLoading = new BehaviorSubject<boolean>(false);
  
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading.next(true);
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.isLoading.next(false);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading.next(false);
      }
    });
  }

  addTodo(): void {
    if (!this.newTask?.trim()) return;
    
    this.isLoading.next(true);
    this.todoService.addTodo(this.newTask).subscribe({
      next: (todo) => {
        this.todos = [...this.todos, todo];
        this.newTask = '';
        this.errorMessage = null;
        this.isLoading.next(false);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading.next(false);
      }
    });
  }

  removeTodo(id: number): void {
    this.isLoading.next(true);
    this.todoService.removeTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.isLoading.next(false);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading.next(false);
      }
    });
  }

  clearError(): void {
    this.errorMessage = null;
  }
}