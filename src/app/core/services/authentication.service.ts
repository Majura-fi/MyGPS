import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { loginInfo } from 'src/app/shared/models/login-info.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends ApiService {
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;
  private localStorageUserKey: string = 'currentUser';

  constructor(private http: HttpClient) {
    super();
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem(this.localStorageUserKey))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  logout() {
    localStorage.removeItem(this.localStorageUserKey);
    this.currentUserSubject.next(null);
  }

  login(info: loginInfo) {
    return this.http.post<User>(`${this.authUrl}/login`, info).pipe(
      tap(user => {
        let json_user = JSON.stringify(user);
        localStorage.setItem(this.localStorageUserKey, json_user);
        this.currentUserSubject.next(user);
      })
    );
  }
}
