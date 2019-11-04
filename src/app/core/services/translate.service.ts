// Source: https://gitlab.com/DenysVuika/medium-i18n

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export function setupTranslateFactory(service: TranslateService): Function {
  return () => service.use('en');
}

@Injectable()
export class TranslateService {
  data: any = {};
  langs: any = {};

  constructor(private http: HttpClient) {}

  use(lang: string): Promise<{}> {
    if (this.langs[lang]) {
      this.data = this.langs[lang];
      return Promise.resolve(this.data);
    }
    return new Promise<{}>((resolve, reject) => {
      this.http
        .get<{}>(`assets/locale/${lang || 'en'}.json`)
        .subscribe(translation => {
          this.data = Object.assign({}, translation || {});
          this.langs[lang] = this.data;
          resolve(this.data);
        });
    });
  }
}
