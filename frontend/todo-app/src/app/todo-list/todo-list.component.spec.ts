import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../todo.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  const mockTodos = [
    { id: 1, task: 'Test Todo 1', isCompleted: false },
    { id: 2, task: 'Test Todo 2', isCompleted: true }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', ['getTodos', 'addTodo', 'removeTodo']);
    
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [],
      providers: [
        { provide: TodoService, useValue: spy }
      ]
    }).compileComponents();

    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', fakeAsync(() => {
    todoService.getTodos.and.returnValue(of(mockTodos));
    
    fixture.detectChanges();
    tick();

    expect(component.todos).toEqual(mockTodos);
    expect(component.isLoading.value).toBeFalse();
  }));

  it('should handle error when loading todos', fakeAsync(() => {
    const errorMsg = 'Failed to load todos';
    todoService.getTodos.and.returnValue(throwError(() => new Error(errorMsg)));
    
    fixture.detectChanges();
    tick();

    expect(component.errorMessage).toBe(errorMsg);
    expect(component.isLoading.value).toBeFalse();
  }));

  it('should add new todo', fakeAsync(() => {
    const newTodo = { id: 3, task: 'New Todo', isCompleted: false };
    todoService.addTodo.and.returnValue(of(newTodo));
    
    component.newTask = 'New Todo';
    component.addTodo();
    tick();

    expect(component.todos).toContain(newTodo);
    expect(component.newTask).toBe('');
    expect(component.isLoading.value).toBeFalse();
  }));

  it('should not add empty todo', fakeAsync(() => {
    component.newTask = '   ';
    component.addTodo();
    tick();

    expect(todoService.addTodo).not.toHaveBeenCalled();
  }));

  it('should remove todo', fakeAsync(() => {
    component.todos = [...mockTodos];
    todoService.removeTodo.and.returnValue(of(void 0));
    
    component.removeTodo(1);
    tick();

    expect(component.todos.length).toBe(1);
    expect(component.todos.find(t => t.id === 1)).toBeUndefined();
  }));

  it('should clear error message', () => {
    component.errorMessage = 'Test error';
    component.clearError();
    expect(component.errorMessage).toBeNull();
  });
});