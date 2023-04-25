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

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.favMovies = resp.FavoriteMovies;
    });
  }

  openGenreDetails(name: string, description: string): void {
    this.dialog.open(MovieGenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
    });
  }

  openDirectorDetails(name: string, bio: string, birth: string): void {
    this.dialog.open(MovieDirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
      },
    });
  }

  openMovieSynopsis(title: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Title: title,
        Description: description,
      },
    });
  }

  toggleFavMovie(id: string): void {
    if (!this.favMovies.includes(id)) {
      this.fetchApiData.addFavoriteMovie(id).subscribe(
        (resp) => {
          // console.log(resp);
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
          // console.log(resp);
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