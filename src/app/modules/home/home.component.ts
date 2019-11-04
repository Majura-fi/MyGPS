import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userName: string = 'Visitor';

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    const user = this.authenticationService.currentUserValue;
    if (user) {
      this.userName = user.display_name;
    }
  }
}
