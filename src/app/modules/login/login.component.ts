import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  displayPassword: boolean = false;
  loginInfo = {
    email: '',
    password: ''
  };
  error = null;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authenticationService.logout();
  }

  togglePasswordDisplay(evt: any) {
    this.displayPassword = !this.displayPassword;
  }

  attemptToLogin() {
    this.authenticationService.login(this.loginInfo).subscribe({
      next: this.handleLogin.bind(this),
      error: this.handleLoginError.bind(this)
    });
  }

  handleLogin(res: any) {
    this.router.navigate(['/overview']);
  }

  handleLoginError(err?: any) {
    this.error = err.error;
    console.error('Login error happened!', err);
  }
}
