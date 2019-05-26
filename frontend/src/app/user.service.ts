import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AccessToken, User } from './models';
import { environment as env } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userKey = 'currentUser';
  private currentUserSubject: BehaviorSubject<User>;
  accessToken: AccessToken;
  currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.accessToken = JSON.parse(localStorage.getItem('accessToken'));
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.userKey)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  get currentUserValue() { return this.currentUserSubject.value; }

  login(email: string, password: string): Observable<AccessToken> {
    const body = { email: email, password: password }; // tslint:disable-line: object-literal-shorthand
    return this.http.post<AccessToken>(`${env.apiUrl}/api/login/`, body)
      .pipe(tap(accessToken => {
        // store user info to keep user loggd in between page refreshes
        localStorage.setItem('accessToken', JSON.stringify(accessToken));
        this.accessToken = accessToken;
        this.getUserInfo().subscribe(user => {
          localStorage.setItem(this.userKey, JSON.stringify(user));
          this.currentUserSubject.next(user);
        });
      }));
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${env.apiUrl}/api/logout/`, null)
      .pipe(tap(data => {
        // remove access token and notify current user as null
        localStorage.removeItem('accessToken');
        localStorage.removeItem(this.userKey);
        this.accessToken = undefined;
        this.currentUserSubject.next(null);
      }));
  }

  clearLoginSession() {
    // Like logout() method: remove access token and user info from local storage
    // But don't send logout API
    // Use this method when API response 401 status code
    localStorage.removeItem('accessToken');
    localStorage.removeItem(this.userKey);
    this.accessToken = undefined;
    this.currentUserSubject.next(null);
  }

  register(email: string, password: string): Observable<User> {
    const body = { email: email, password: password }; // tslint:disable-line: object-literal-shorthand
    return this.http.post<User>(`${env.apiUrl}/api/register/`, body);
  }

  getUserInfo(): Observable<User> {
    return this.http.get<User>(`${env.apiUrl}/api/me/`);
  }
}
