import { Component, Input } from '@angular/core';
import { RecordedLocation } from '../../models/recordedlocation.model';

@Component({
  selector: 'app-selected-point-info',
  templateUrl: './selected-point-info.component.html',
  styleUrls: ['./selected-point-info.component.scss']
})
export class SelectedPointInfoComponent {
  @Input() point: RecordedLocation;
  @Input() index: number;

  pointHasField(fieldName: string): boolean {
    return typeof this.point[fieldName] !== 'undefined';
  }
}
