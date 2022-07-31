import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'https://ll-portfolio-ap-login.herokuapp.com/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }




  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'authenticate', {
      username,
      password
    }, httpOptions);

  }

  // register(username: string, firstName: string, lastName: string,
  //          password: string, country: string, city: string): Observable<any> {
  //   return this.http.post(AUTH_API + 'register', {
  //     username,
  //     password,
  //   }, httpOptions);
  // }

}
