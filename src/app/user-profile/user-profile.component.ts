import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  favMovies: any = [];


  @Input() updatedUser = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserInfos();
  }

  getUserInfos(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.favMovies = resp.FavoriteMovies;
      // console.log(resp);
      this.updatedUser.Username = this.user.Username;
      this.updatedUser.Email = this.user.Email;
      this.updatedUser.Birthday = this.user.Birthday;
      return this.user;
    });
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.updatedUser).subscribe((resp) => {
      // console.log(resp);
      localStorage.setItem('user', this.updatedUser.Username);
      window.location.reload();
      this.snackBar.open('Your profile has been successfuly updated!', 'OK', {
        duration: 4000,
      });

    });
  }

  deleteUser(): void {
    if (
      confirm(
        'Deleting your account will permanently erase all your information. Do you want to proceed?'
      )
    ) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'Your account has been successfully deleted. We hope to see you again soon!',
          'OK',
          {
            duration: 4000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((resp) => {
        // console.log(resp);
        localStorage.clear();
      });
    }
  }
}
