import { Common } from '../common';
import { RecordedLocation_server } from './server-models';

export class RecordedLocation {
  accuracy: number;
  altitude: number;
  guid: number;
  latitude: number;
  longitude: number;
  pathmeta_id: number;
  speed: number;
  time_gmt: Date;

  static deserialize(val: RecordedLocation_server): RecordedLocation {
    let loc = new RecordedLocation();
    loc.accuracy = val.accuracy;
    loc.altitude = val.altitude;
    loc.guid = val.guid;
    loc.latitude = val.latitude;
    loc.longitude = val.longitude;
    loc.pathmeta_id = val.pathmeta_id;
    loc.speed = val.speed;
    loc.time_gmt = Common.deserializeDate(val.time_gmt);
    return loc;
  }
}
