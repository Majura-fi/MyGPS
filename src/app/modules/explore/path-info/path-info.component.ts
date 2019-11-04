import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { PathService } from 'src/app/core/services/path.service';
import { Path } from 'src/app/shared/models/path.model';
import { RecordedLocation } from 'src/app/shared/models/recordedlocation.model';
import { getDistance } from 'ol/sphere';
import { Common } from 'src/app/shared/common';
import { PathMeta } from 'src/app/shared/models/pathmeta.model';

export interface PointChange {
  index: number;
  point: RecordedLocation;
}

@Component({
  selector: 'app-path-info-component',
  templateUrl: './path-info.component.html',
  styleUrls: ['./path-info.component.scss']
})
export class PathInfoComponent implements OnInit {
  public jumpToLatest: boolean = true;
  public path_id_previous: number;
  public path_id_next: number;

  _stats: any = {};
  get stats() {
    return this._stats;
  }

  _path: Path;
  get path(): Path {
    return this._path;
  }

  _selectedPoint: RecordedLocation;
  get selectedPoint(): RecordedLocation {
    return this._selectedPoint;
  }

  _selectedPointIndex: number = 0;
  set selectedPointIndex(index: number) {
    this._selectedPointIndex = index;
    this._selectedPoint = this._path.points[index];

    this.selectedPointChanged.emit({
      index: this.selectedPointIndex,
      point: this._selectedPoint
    });
  }
  get selectedPointIndex(): number {
    return this._selectedPointIndex;
  }

  get isLive(): boolean {
    return Common.isLivePath(this._path.meta);
  }

  @Output() selectedPointChanged = new EventEmitter<PointChange>();

  constructor(private pathService: PathService) {}

  ngOnInit(): void {}

  get lastPointIndex(): number {
    if (!this._path || !this._path.points) return 0;
    return this._path.points.length - 1;
  }

  public setCurrentPointIndex(index: number) {
    this._selectedPoint = this._path.points[index];
    this.selectedPointIndex = index;
  }

  public setPath(path: Path) {
    this._path = path;
    this.setCurrentPointIndex(0);
    this._stats = this._calculateStats(path);
  }

  public async setPathById(pathId: number) {
    const path = await this.pathService.getPathById(pathId).toPromise();
    this.setPath(path);
  }

  private _calculateStats(path: Path): any {
    const stats = {
      averageSpeed: 0,
      highestSpeed: 0,
      lowestSpeed: Number.MAX_VALUE,
      distance: 0
    };

    for (let index = 0; index < path.points.length; index++) {
      let point = path.points[index];

      // Average speed.
      stats.averageSpeed += point.speed;
      stats.highestSpeed = Math.max(stats.highestSpeed, point.speed);
      stats.lowestSpeed = Math.min(stats.lowestSpeed, point.speed);

      let earlierPoint = path.points[index - 1];
      if (earlierPoint) {
        // Distance.
        stats.distance += getDistance(
          [point.longitude, point.latitude],
          [earlierPoint.longitude, earlierPoint.latitude]
        );
      }
    }

    // Average speed.
    if (path.points.length) {
      stats.averageSpeed /= path.points.length;
    } else {
      stats.lowestSpeed = 0;
    }

    return stats;
  }

  public pointHasField(fieldName: string): boolean {
    return typeof this._selectedPoint[fieldName] !== 'undefined';
  }
}
