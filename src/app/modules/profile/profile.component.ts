import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { User } from 'src/app/shared/models/user.model';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user: User;
  public hasUnsavedChanges: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService
  ) {}

  public ngOnInit(): void {
    this.usersService.getProfile().subscribe(user => {
      this.user = user;
    });
  }

  public changed() {
    this.hasUnsavedChanges = true;
  }
}
