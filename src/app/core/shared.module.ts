import { NgModule, APP_INITIALIZER } from '@angular/core';
import { TranslatePipe } from '../shared/pipes/translate.pipe';
import {
  TranslateService,
  setupTranslateFactory
} from './services/translate.service';
import { DecimalsPipe } from '../shared/pipes/decimals.pipe';
import { GPSMapComponent } from '../shared/components/gps-map/gps-map.component';
import { PathPointSelectorComponent } from '../shared/components/path-point-selector/path-point-selector.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TranslatePipe,
    DecimalsPipe,
    GPSMapComponent,
    PathPointSelectorComponent
  ],
  providers: [
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true
    }
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    TranslatePipe,
    DecimalsPipe,
    GPSMapComponent,
    PathPointSelectorComponent
  ]
})
export class SharedModule {}
