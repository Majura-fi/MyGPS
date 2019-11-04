import { RecordedLocation } from './recordedlocation.model';
import { Common } from '../common';
import { PathMeta } from './pathmeta.model';
import { RecordedLocation_server } from './server-models';

export class Path {
  public points: RecordedLocation[];
  public meta?: PathMeta;

  setMeta(meta: PathMeta) {
    this.meta = meta;
  }

  sortPoints() {
    this.points = this.points.sort((a, b) => {
      return a.time_gmt.getTime() - b.time_gmt.getTime();
    });
  }

  getLastPoint(): RecordedLocation {
    return this.points[this.points.length - 1];
  }

  static deserialize(input: RecordedLocation_server[]): Path {
    let path = new Path();
    input.forEach(point =>
      path.points.push({
        accuracy: point.accuracy,
        altitude: point.altitude,
        guid: point.guid,
        latitude: point.latitude,
        longitude: point.longitude,
        pathmeta_id: point.pathmeta_id,
        speed: point.speed,
        time_gmt: Common.deserializeDate(point.time_gmt)
      })
    );
    return path;
  }
}
