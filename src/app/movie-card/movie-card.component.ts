import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieGenreComponent } from '../movie-genre/movie-genre.component';
import { MovieDirectorComponent } from '../movie-director/movie-director.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Input } from '@angular/core';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})

export class MovieCardComponent {
  @Input() movies: any[] = [];
  @Input() favMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * Get all movies from the API
   * @function getMovies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  /**
   * Get the user's favorite movies list from the API
   * @function getFavoriteMovies
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.favMovies = resp.FavoriteMovies;
    });
  }

  /**
   * Open a dialog to show the details of a movie genre
   * @param {string} name - The name of the genre
   * @param {string} description - The description of the genre
   * @function openGenreDetails
   */
  openGenreDetails(name: string, description: string): void {
    this.dialog.open(MovieGenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
    });
  }

  /**
   * Open a dialog to show the details of a movie director
   * @param {string} name - The name of the director
   * @param {string} bio - The biography of the director
   * @param {string} birth - The birth date of the director
   * @function openDirectorDetails
   */
  openDirectorDetails(name: string, bio: string, birth: string): void {
    this.dialog.open(MovieDirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
      },
    });
  }

  /**
   * Open a dialog displaying the synopsis of a movie
   * @param {string} title - The title of the movie
   * @param {string} description - The description of the movie
   * @function openMovieSynopsis
   */
  openMovieSynopsis(title: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Title: title,
        Description: description,
      },
    });
  }

  /**
   * Add or remove a movie from favorites based on current status
   * @param {string} id - The id of the movie to add or remove from favorites
   * @function toggleFavMovie
   */
  toggleFavMovie(id: string): void {
    if (!this.favMovies.includes(id)) {
      this.fetchApiData.addFavoriteMovie(id).subscribe(
        (resp) => {
          console.log(resp);
          this.favMovies.push(id);
          this.snackBar.open('Movie added to favorites.', 'OK', {
            duration: 3000,
          });
        },
        (res) => {
          // Error response
          this.snackBar.open(res.message, 'OK', {
            duration: 4000,
          });
        }
      );
    } else {
      this.fetchApiData.deleteFavoriteMovie(id).subscribe(
        (resp) => {
          console.log(resp);
          const index = this.favMovies.indexOf(id);
          if (index > -1) {
            this.favMovies.splice(index, 1);
            this.snackBar.open('Movie removed from favorites.', 'OK', {
              duration: 3000,
            });
          }
        },
        (res) => {
          // Error response
          this.snackBar.open(res.message, 'OK', {
            duration: 4000,
          });
        }
      );
    }
  }
}