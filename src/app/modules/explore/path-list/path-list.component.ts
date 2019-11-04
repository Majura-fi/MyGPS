import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { PathService } from 'src/app/core/services/path.service';
import { PathMeta } from 'src/app/shared/models/pathmeta.model';
import { Common } from 'src/app/shared/common';

@Component({
  selector: 'app-path-list-component',
  templateUrl: './path-list.component.html',
  styleUrls: ['./path-list.component.scss']
})
export class PathListComponent implements OnInit, OnDestroy {
  public metas: PathMeta[];
  pathListUpdateHandle: any;

  @Output() onPathSelected = new EventEmitter<PathMeta>();

  constructor(private pathService: PathService) {}

  ngOnInit(): void {
    this.updatePathMetas();
    this.startPathListUpdating();
  }

  ngOnDestroy(): void {
    this.stopPathListUpdating();
  }

  _onPathSelected(meta: PathMeta) {
    this.onPathSelected.emit(meta);
  }

  private startPathListUpdating() {
    if (this.pathListUpdateHandle) {
      return;
    }
    this.pathListUpdateHandle = setInterval(() => {
      this.updatePathMetas();
    }, 15000);
  }

  isLive(path: PathMeta) {
    return Common.isLivePath(path);
  }

  private stopPathListUpdating() {
    if (this.pathListUpdateHandle) {
      clearInterval(this.pathListUpdateHandle);
      this.pathListUpdateHandle = null;
    }
  }

  /**
   * Requests meta information from the server.
   */
  private updatePathMetas(): void {
    this.pathService.getPathMetas().subscribe(metas => {
      this.metas = metas.sort((a: PathMeta, b: PathMeta) => {
        return b.firstPointTime.getTime() - a.firstPointTime.getTime();
      });
    });
  }
}
