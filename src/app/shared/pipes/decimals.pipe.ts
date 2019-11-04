import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'decimals' })
export class DecimalsPipe implements PipeTransform {
  transform(value: number, decimals: number = 2): number {
    let multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
  }
}
