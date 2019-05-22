import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessToken, User } from './models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendHost = 'http://localhost:8000';
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<AccessToken> {
    return this.http.post<AccessToken>(
      `${this.backendHost}/api/login/`, 
      {email: email, password: password},
      httpOptions);
  }

  register(email: string, password: string): Observable<User> {
    return this.http.post<User>(
      `${this.backendHost}/api/register/`,
      {email: email, password: password},
      httpOptions
    )
  }

  getUserInfo(accessToken: string): Observable<User> {
    const options = {
      headers: new HttpHeaders({'Authorization': `Bearer ${accessToken}`})
    }
    return this.http.get<User>(`${this.backendHost}/api/me/`, options);
  }
}
