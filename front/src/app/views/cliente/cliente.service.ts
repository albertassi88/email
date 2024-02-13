import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  genericGet<T>(endpoint: string, id?: string): Observable<T> {
    let url = `${this.apiUrl}/${endpoint}`;
    if(id) {
      url = `${url}/${id}`;
    }
    return this.http.get<T>(url)
      .pipe(map((response: T) => response));
  }

  genericGetHeaders<T>(endpoint: string, id?: string, headers?: any): Observable<T> {
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    let url = `${this.apiUrl}/${endpoint}`;
    if(id) {
      url = `${url}/${id}`;
    }
    return this.http.get<T>(url, httpOptions)
    .pipe(map((response: T) => response));
  }

  genericPost<T>(endpoint: string, data: any): Observable<T> {
    const urlAux = this.apiUrl;
    const httpOptions = {
      headers: new HttpHeaders()
    };
    const url = `${urlAux}/${endpoint}`;
    return this.http.post<T>(url, data, httpOptions)
      .pipe(map((response: T) => response));
  }

  genericPostId<T>(endpoint: string, id: string, data: any, headers?: any): Observable<T> {
    const urlAux = this.apiUrl;
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    const url = `${urlAux}/${endpoint}/${id}`;
    return this.http.post<T>(url, data, httpOptions)
      .pipe(map((response: T) => response));
  }

  genericPutId<T>(endpoint: string, id?: string, data?: any, headers?: any): Observable<T> {
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    let url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.put<T>(url, data, httpOptions)
      .pipe(map((response: T) => response));
  }

  genericPut<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;

    return this.http.put<T>(url, data)
      .pipe(map((response: T) => response));
  }

  genericDelete<T>(endpoint: string, id: string): Observable<T> {
    const url = id ? `${this.apiUrl}/${endpoint}/${id}` : `${this.apiUrl}/${endpoint}`;
    return this.http.delete<T>(url)
      .pipe(map((response: T) => response));
  }

  genericPutBody<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    let params = new HttpParams()

    return this.http.put<T>(url, body, { params })
      .pipe(map((response: T) => {
        return response;
      }));
  }
}
