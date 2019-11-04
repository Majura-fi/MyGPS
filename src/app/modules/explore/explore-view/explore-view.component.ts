import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { PathService } from '../../../core/services/path.service';
import { GPSMapComponent } from 'src/app/shared/components/gps-map/gps-map.component';
import {
  PathInfoComponent,
  PointChange
} from '../path-info/path-info.component';
import { PathListComponent } from '../path-list/path-list.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Path } from 'src/app/shared/models/path.model';
import { PathPointSelectorComponent } from 'src/app/shared/components/path-point-selector/path-point-selector.component';
import { PathMeta } from 'src/app/shared/models/pathmeta.model';

@Component({
  selector: 'app-explore-view',
  templateUrl: './explore-view.component.html',
  styleUrls: ['./explore-view.component.scss'],
  providers: [PathService]
})
export class ExploreViewComponent implements OnInit, AfterViewInit {
  private _map: GPSMapComponent;
  private _pathInfo: PathInfoComponent;
  private _pathList: PathListComponent;
  private _currentPointIndex: number = 0;
  private _pointSelector: PathPointSelectorComponent;
  private _currentPath: Path;
  public sidePanelVisible: boolean = true;

  public set currentPath(val: Path) {
    this._currentPath = val;
    this._map.setPath(val);
  }

  public get currentPath(): Path {
    return this._currentPath;
  }

  @ViewChild(GPSMapComponent, { static: false })
  public set map(compRef: GPSMapComponent) {
    if (!compRef) return;
    this._map = compRef;
    this._map.setPath(this.currentPath);
  }

  @ViewChild(PathPointSelectorComponent, { static: false })
  public set pointSelector(compRef: PathPointSelectorComponent) {
    if (!compRef) return;
    this._pointSelector = compRef;
    this._pointSelector.maxValue = this.lastPointIndex;
  }
  public get lastPointIndex(): number {
    if (!this.currentPath) {
      return 0;
    }
    return this.currentPath.points.length - 1;
  }

  public set currentPointIndex(index: number) {
    this._currentPointIndex = index;
    this._map.setPin(this.currentPath.points[index]);
    this._pathInfo.setCurrentPointIndex(index);
    if (this._pointSelector) this._pointSelector.currentValue = index;
  }
  public get currentPointIndex(): number {
    return this._currentPointIndex;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private pathService: PathService
  ) {}

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    let pathId = this.getRouteParam('pathid');
    if (pathId) {
      this.setPathById(pathId);
    }
  }

  private getRouteParam(name: string): any {
    return this.activatedRoute.snapshot.firstChild.params[name];
  }

  public onRouterActivate(compRef: Component) {
    if (compRef instanceof PathInfoComponent) {
      this.setupPathInfo(compRef as PathInfoComponent);
    } else if (compRef instanceof PathListComponent) {
      this.setupPathList(compRef as PathListComponent);
    } else {
      console.warn('Unknown component', compRef);
    }
  }

  private setupPathList(compRef: PathListComponent) {
    if (!compRef) return;
    this._pathList = compRef;
    this._pathList.onPathSelected.subscribe((meta: PathMeta) => {
      if (!meta) return;
      this.setPathById(meta.id);
    });
    if (this._map) this._map.clearAll();
  }

  private setupPathInfo(compRef: PathInfoComponent) {
    if (!compRef) return;
    this._pathInfo = compRef;
    this._pathInfo.selectedPointChanged.subscribe((evt: PointChange) => {
      this._map.setPin(evt.point);
      if (this._pointSelector) {
        this._pointSelector.currentValue = evt.index;
      }
    });
    if (this.currentPath) this._pathInfo.setPath(this.currentPath);
    if (this._map) this._map.setPath(this.currentPath);
  }

  private setPathById(pathId: number) {
    this.pathService.getPathById(pathId).subscribe(path => {
      this.currentPath = path;
      if (this._map) this._map.setPath(this.currentPath);
      if (this._pathInfo) this._pathInfo.setPath(this.currentPath);
      if (this._pointSelector) {
        let points = this.currentPath.points.length;
        let lastIndex = points > 0 ? points - 1 : 0;
        this._pointSelector.maxValue = lastIndex;
      }
      this.currentPointIndex = 0;
    });
  }

  public toggleSidePanel(): void {
    this.sidePanelVisible = !this.sidePanelVisible;
  }
}
