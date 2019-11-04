import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { User } from 'src/app/shared/models/user.model';
import { UsersService } from 'src/app/core/services/users.service';
import { EditedUser } from 'src/app/shared/models/edited-user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  public user: User;
  public editedUser: EditedUser;
  public password = {
    new1: '',
    new2: '',
    current: '',
    display: false,
    isValid: () => {
      if (this.password.display) {
        return true;
      }
      return this.password.new1 === this.password.new2;
    }
  };
  public name = {
    available: true,
    timer: undefined
  };

  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.usersService.getProfile().subscribe(user => {
      this.user = user;
      this.editedUser = {
        id: user.id,
        current_password: '',
        new_password: '',
        new_email: user.email,
        new_display_name: user.display_name,
        new_api_key: user.api_key
      };
    });
  }

  public checkName() {
    if (this.name.timer) {
      clearTimeout(this.name.timer);
    }
    this.name.timer = setTimeout(() => {
      this.usersService
        .checkName(this.editedUser.new_display_name)
        .subscribe(available => {
          this.name.available = available;
        });
    }, 500);
  }

  public generateApiKey() {
    this.usersService.generateApiKey().subscribe(apikey => {
      this.editedUser.new_api_key = apikey;
    });
  }

  public removeApiKey() {
    this.usersService.removeApiKey().subscribe(res => {
      this.editedUser.new_api_key = '';
    });
  }

  public save() {
    this.usersService.updateUser(this.editedUser).subscribe(res => {
      // TODO
    });
  }

  public cancel() {
    this.router.navigate(['/profile']);
  }
}
