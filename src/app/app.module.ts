import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { AngularResizedEventModule } from 'angular-resize-event';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './core/routing.module';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { TopNavigationComponent } from './core/header/header.component';
import { ProfileEditComponent } from './modules/profile/profile-edit/profile-edit.component';
import { LogoutComponent } from './modules/logout/logout.component';
import { SharedModule } from './core/shared.module';
import { ExploreViewComponent } from './modules/explore/explore-view/explore-view.component';
import { ExploreModule } from './modules/explore/explore.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    ExploreViewComponent,
    PageNotFoundComponent,
    ProfileComponent,
    ProfileEditComponent,
    TopNavigationComponent
  ],
  imports: [
    AngularResizedEventModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ExploreModule,
    RoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
