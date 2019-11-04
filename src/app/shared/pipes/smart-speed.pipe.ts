import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'smartSpeed' })
export class SmartSpeedPipe implements PipeTransform {
  transform(value: number): string {
    let kmph = value * 3.6;
    kmph = Math.round(kmph * 100) / 100;
    value = Math.round(value * 100) / 100;

    if (kmph > 0) {
      return `${kmph} km/h`;
    }
    return `${value} m/s`;
  }
}
