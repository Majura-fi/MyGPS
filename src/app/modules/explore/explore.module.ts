import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/core/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SmartDurationPipe } from 'src/app/shared/pipes/smart-duration.pipe';
import { SmartSpeedPipe } from 'src/app/shared/pipes/smart-speed.pipe';
import { PathInfoComponent } from './path-info/path-info.component';
import { PathListComponent } from './path-list/path-list.component';
import { ExploreRoutingModule } from './explore-routing.module';
import { SelectedPointInfoComponent } from 'src/app/shared/components/selected-point-info/selected-point-info.component';

@NgModule({
  declarations: [
    PathInfoComponent,
    PathListComponent,
    SelectedPointInfoComponent,
    SmartDurationPipe,
    SmartSpeedPipe
  ],
  imports: [ExploreRoutingModule, SharedModule, CommonModule, FormsModule]
})
export class ExploreModule {}
