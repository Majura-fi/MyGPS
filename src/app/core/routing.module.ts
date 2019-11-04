import { RouterModule, Route } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from '../modules/home/home.component';
import { LoginComponent } from '../modules/login/login.component';
import { PageNotFoundComponent } from '../modules/page-not-found/page-not-found.component';
import { ProfileComponent } from '../modules/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileEditComponent } from '../modules/profile/profile-edit/profile-edit.component';
import { LogoutComponent } from '../modules/logout/logout.component';

const appRoutes: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'profile/edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false
    })
  ],
  exports: [RouterModule]
})
export class RoutingModule {}
