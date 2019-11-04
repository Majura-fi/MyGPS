import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { Observable } from 'rxjs';
import { NameCheckPayload } from 'src/app/shared/models/name-check-payload.model';
import { EditedUser } from 'src/app/shared/models/edited-user.model';
import { AuthenticationService } from './authentication.service';
import { NameCheckResponse } from 'src/app/shared/models/server-models';

@Injectable({ providedIn: 'root' })
export class UsersService extends ApiService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    super();
  }

  getUser(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.usersUrl}/${id}`)
      .pipe(catchError(this.handleError<any>('getUser')));
  }

  private createAuthHeaders(headers?: HttpHeaders) {
    let token = this.authService.currentUserValue.token;
    token = btoa(token + ':');

    headers = headers || new HttpHeaders();
    headers = headers.append('Authorization', `Basic ${token}`);
    return headers;
  }

  getProfile(): Observable<User> {
    let options = {
      headers: this.createAuthHeaders()
    };
    return this.http
      .get<User>(`${this.usersUrl}/profile`, options)
      .pipe(catchError(this.handleError<any>('getProfile')));
  }

  checkName(name: string): Observable<boolean> {
    let data: NameCheckPayload = {
      name: name
    };
    return this.http
      .post<NameCheckResponse>(`${this.usersUrl}/check_name`, data)
      .pipe(
        map(res => {
          return res.available;
        }),
        catchError(this.handleError<any>('check_name'))
      );
  }

  generateApiKey(): Observable<string> {
    let options = {
      headers: this.createAuthHeaders()
    };
    return this.http.patch<User>(`${this.usersUrl}/api_key`, {}, options).pipe(
      map(res => {
        return res.api_key;
      })
    );
  }

  removeApiKey(): Observable<any> {
    let options = {
      headers: this.createAuthHeaders()
    };
    return this.http
      .delete(`${this.usersUrl}/api_key`, options)
      .pipe(catchError(this.handleError<any>('RemoveApiKey')));
  }

  updateUser(user: EditedUser): Observable<any> {
    return this.http.patch<User>(`${this.usersUrl}/${user.id}`, user);
  }
}
