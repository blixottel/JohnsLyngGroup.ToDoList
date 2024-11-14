import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { environment } from '../environments/environment';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Rest of the test cases remain the same
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get todos', () => {
    const mockTodos = [
      { id: 1, task: 'Test Todo', isCompleted: false }
    ];

    service.getTodos().subscribe(todos => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todo`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should add todo', () => {
    const mockTodo = { id: 1, task: 'New Todo', isCompleted: false };

    service.addTodo('New Todo').subscribe(todo => {
      expect(todo).toEqual(mockTodo);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todo`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(JSON.stringify('New Todo'));
    req.flush(mockTodo);
  });

  it('should remove todo', () => {
    service.removeTodo(1).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/todo/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle client error', () => {
    service.getTodos().subscribe({
      error: (error) => {
        expect(error.message).toContain('Client error');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todo`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle server error', () => {
    service.getTodos().subscribe({
      error: (error) => {
        expect(error.message).toContain('Server error');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todo`);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});