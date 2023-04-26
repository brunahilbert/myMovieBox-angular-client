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

  /**
   * Gets the user's data by making an API call and updates the component's state with the obtained information
   * @function getUserInfos
   */
  getUserInfos(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.favMovies = resp.FavoriteMovies;
      this.updatedUser.Username = this.user.Username;
      this.updatedUser.Email = this.user.Email;
      this.updatedUser.Birthday = this.user.Birthday;
      return this.user;
    });
  }

  /**
   * Sends an API request to update the user's information with the updatedUser object, and then reloads the page
   * @function updateUser
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.updatedUser).subscribe((resp) => {
      localStorage.setItem('user', this.updatedUser.Username);
      window.location.reload();
      this.snackBar.open('Your profile has been successfuly updated!', 'OK', {
        duration: 4000,
      });

    });
  }

  /**
   * Deletes the user's account and clears their local storage if the user confirms the deletion
   * Navigates to the welcome page and displays a snackbar notification upon successful deletion
   * @function deleteUser
   */
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
        console.log(resp);
        localStorage.clear();
      });
    }
  }
}
