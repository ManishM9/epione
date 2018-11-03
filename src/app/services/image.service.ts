import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getImagesLength(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>("imagelen", { sendlen: true }, httpOptions);
  }

  login(obj: any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>("login", { username: obj.username, password: obj.password }, httpOptions);
  }

  getLogin(): Observable<any>{
    return this.http.get<any>("getlogin");
  }

  getfit(): Observable<any>{
    return this.http.get<any>("getfit")
  }


}
