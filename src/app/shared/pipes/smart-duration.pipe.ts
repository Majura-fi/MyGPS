import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'smartDuration' })
export class SmartDurationPipe implements PipeTransform {
  transform(value: number): string {
    let h = Math.floor(value / 3600);
    let m = Math.floor((value % 3600) / 60);
    let s = Math.floor((value % 3600) % 60);
    let dh = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
    let dm = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
    let ds = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';

    return dh + dm + ds;
  }
}
