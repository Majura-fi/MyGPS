import { PathMeta } from './models/pathmeta.model';
import { RecordedLocation } from './models/recordedlocation.model';

export class Common {
  static SECOND = 1000;
  static THIRTY_SECONDS = 30 * Common.SECOND;
  static MINUTE = 60 * Common.SECOND;
  static HOUR = 60 * Common.MINUTE;

  static isLivePath(meta: PathMeta) {
    let THIRTY_SECONDS_AGO = new Date().getTime() - this.THIRTY_SECONDS;
    return meta.lastPointTime.getTime() > THIRTY_SECONDS_AGO;
  }

  static isLiveLocation(location: RecordedLocation): boolean {
    let THIRTY_SECONDS_AGO = new Date().getTime() - this.THIRTY_SECONDS;
    return location.time_gmt.getTime() > THIRTY_SECONDS_AGO;
  }

  static isColdPath(meta: PathMeta): boolean {
    let ONE_HOUR_AGO = new Date().getTime() - this.HOUR;
    return meta.lastPointTime.getTime() < ONE_HOUR_AGO;
  }

  static isWarmPath(meta: PathMeta): boolean {
    let ONE_HOUR_AGO = new Date().getTime() - this.HOUR;
    return meta.lastPointTime.getTime() > ONE_HOUR_AGO;
  }

  static deserializeDate(value: string) {
    let date = new Date(value);
    if (isNaN(date.getTime())) {
      console.trace(value);
      throw new Error('Cannot deserialize date!');
    }
    return date;
  }
}
