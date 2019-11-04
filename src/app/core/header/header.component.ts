import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { TranslateService } from '../services/translate.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class TopNavigationComponent {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private translationService: TranslateService
  ) {}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return !!this.authenticationService.currentUserValue;
  }

  setLanguage(lang: string) {
    this.translationService.use(lang);
  }
}
