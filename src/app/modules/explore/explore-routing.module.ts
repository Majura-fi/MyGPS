import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PathListComponent } from './path-list/path-list.component';
import { PathInfoComponent } from './path-info/path-info.component';
import { ExploreViewComponent } from './explore-view/explore-view.component';

const appRoutes: Routes = [
  {
    path: 'explore',
    component: ExploreViewComponent,
    children: [
      {
        path: 'list',
        component: PathListComponent
      },
      {
        path: 'path/:pathid',
        component: PathInfoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule {}
