import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  genericDelete<T>(endpoint: string, id: string): Observable<T> {
    const url = id ? `${this.apiUrl}/${endpoint}/${id}` : `${this.apiUrl}/${endpoint}`;
    return this.http.delete<T>(url)
      .pipe(map((response: T) => response));
  }

  genericDeleteParams<T>(endpoint: string, id: string, params: string, headers?: any): Observable<T> {
    const url = id ? `${this.apiUrl}/${endpoint}/${id}${params}` : `${this.apiUrl}/${endpoint}`;
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.delete<T>(url, httpOptions)
      .pipe(map((response: T) => response));
  }

  genericPutParams<T>(endpoint: string, params: string, body: any, headers?: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${params}`;
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.put<T>(url, body, httpOptions)
      .pipe(map((response: T) => {
        return response;
      }));
  }

  genericPutParamsId<T>(endpoint: string, id: string, params: string, body: any, headers?: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${id}${params}`;
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.put<T>(url, body, httpOptions)
      .pipe(map((response: T) => {
        return response;
      }));
  }

  genericPut<T>(endpoint: string, body: any, headers?: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.put<T>(url, body, httpOptions)
      .pipe(map((response: T) => {
        return response;
      }));
  }
}
