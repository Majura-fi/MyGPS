// Based on: https://gitlab.com/DenysVuika/medium-i18n
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from 'src/app/core/services/translate.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(key: any, ...args: any[]): string {
    let template = this.translate.data[key];
    if (!template) {
      return key;
    }

    return template.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  }
}
