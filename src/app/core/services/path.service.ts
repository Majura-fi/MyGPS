import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Path } from '../../shared/models/path.model';
import { PathMeta } from '../../shared/models/pathmeta.model';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { RecordedLocation } from 'src/app/shared/models/recordedlocation.model';
import {
  PathMeta_server,
  MetaPathCombo_server
} from 'src/app/shared/models/server-models';

@Injectable({ providedIn: 'root' })
export class PathService extends ApiService {
  constructor(private http: HttpClient) {
    super();
  }

  public getPathMetas(): Observable<PathMeta[]> {
    return this.http.get<PathMeta_server[]>(`${this.pathsUrl}/list`).pipe(
      map(res => res.map(pm => PathMeta.deserialize(pm))),
      catchError(this.handleError<any>('getPaths', []))
    );
  }

  public getPathMeta(pathId: number): Observable<PathMeta> {
    return this.http
      .get<PathMeta_server>(`${this.pathsUrl}/meta/${pathId}`)
      .pipe(
        map(res => {
          return PathMeta.deserialize(res);
        }),
        catchError(this.handleError<any>('getPathMeta'))
      );
  }

  public updatePath(path: Path): Observable<Path> {
    let pathId = path.meta.id;
    let lastLocation = path.getLastPoint();
    let lastLocationId = lastLocation ? lastLocation.guid : 0;

    return this.http
      .get<MetaPathCombo_server>(
        `${this.pathsUrl}/${pathId}?last_location_id=${lastLocationId}`
      )
      .pipe(
        map(res => {
          let newPoints = res.path.map(loc =>
            RecordedLocation.deserialize(loc)
          );

          let updatedPath = new Path();
          updatedPath.meta = PathMeta.deserialize(res.meta);
          updatedPath.points = path.points.concat(newPoints);
          updatedPath.sortPoints();

          return updatedPath;
        })
      );
  }

  public getPathById(pathId: number) {
    return this.http
      .get<MetaPathCombo_server>(`${this.pathsUrl}/${pathId}`)
      .pipe(
        map(res => {
          let meta = PathMeta.deserialize(res.meta);
          let locations = res.path.map(loc =>
            RecordedLocation.deserialize(loc)
          );
          let path = new Path();
          path.points = locations;
          path.meta = meta;
          return path;
        }),
        catchError(this.handleError<any>('getPath'))
      );
  }

  public deletePath(id: number) {
    return this.http
      .delete(`${this.pathsUrl}/${id}`)
      .pipe(catchError(this.handleError<any>('deletePath')));
  }

  public patchPathMeta(meta: PathMeta): Observable<PathMeta> {
    return this.http
      .patch<PathMeta_server>(`${this.pathsUrl}/${meta.id}`, meta)
      .pipe(
        map(meta => PathMeta.deserialize(meta)),
        catchError(this.handleError<any>('modifyPathMeta'))
      );
  }
}
