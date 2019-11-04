import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';

//@Injectable({ providedIn: 'root' })
export class ApiService {
  protected usersUrl = environment.API_URL + '/users';
  protected pathsUrl = environment.API_URL + '/paths';
  protected authUrl = environment.API_URL + '/auth';

  protected handleError<T>(operation = 'unknown', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`Api method "${operation}" caused an error: `, error);
      return of(result as T);
    };
  }
}
