import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(public router: Router) { }

  /**
   * Clear the user session and redirect to the welcome page
   * @function logout
   */
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}