import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface ToDoItem {
  id: number;
  task: string;
  isCompleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todo`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    const msg = error.error instanceof ErrorEvent ? 
      `Client error: ${error.error.message}` : 
      `Server error: ${error.status} ${error.message}`;
    return throwError(() => new Error(msg));
  }

  getTodos(): Observable<ToDoItem[]> {
    return this.http.get<ToDoItem[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  addTodo(task: string): Observable<ToDoItem> {
    return this.http.post<ToDoItem>(this.apiUrl, JSON.stringify(task), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
}