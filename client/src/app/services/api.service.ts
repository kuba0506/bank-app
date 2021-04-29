import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<any> {
    try {
      return this.http.get<T>(`${url}`);
    } catch (err) {
      console.error(err);
    }
  }

  post<T>(url: string, body: any): Observable<any> {
    try {
      return this.http.post<T>(`${url}`, body);
    } catch (err) {
      console.error(err);
    }
  }
}
