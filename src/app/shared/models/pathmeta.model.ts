import { Path } from './path.model';
import { Common } from '../common';
import { PathMeta_server } from './server-models';

export class PathMeta {
  id: number;
  ownerId: number;
  ownerName: string;
  name: string;
  pointCount: number;
  firstPointTime: Date;
  lastPointTime: Date;
  durationSeconds: number;

  static deserialize(input: PathMeta_server): PathMeta {
    let meta = new PathMeta();
    meta.id = input.id;
    meta.ownerId = input.owner_id;
    meta.ownerName = input.owner_name;
    meta.name = input.name;
    meta.pointCount = input.point_count;
    meta.firstPointTime = Common.deserializeDate(input.first_point_time);
    meta.lastPointTime = Common.deserializeDate(input.last_point_time);
    meta.durationSeconds = input.duration_seconds;
    return meta;
  }
}
