import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserService }
  from '../../../core/services/user';

import { AppUser }
  from '../../../shared/models/user.model';


@Component({
  selector: 'app-authors',

  imports: [
    FormsModule
  ],

  templateUrl: './authors.html',
  styleUrl: './authors.scss'
})
export class Authors implements OnInit {

  // All registered writers
  authors: AppUser[] = [];

  // Writers displayed after search
  filteredAuthors: AppUser[] = [];

  searchTerm = '';

  isLoading = true;

  errorMessage = '';


  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}


  async ngOnInit(): Promise<void> {

    try {

      // Get users where role = writer
      this.authors =
        await this.userService
          .getWriters();


      this.filteredAuthors =
        [...this.authors];


      console.log(
        'Loaded writers:',
        this.authors
      );


    } catch (error) {

      console.error(
        'Error loading authors:',
        error
      );

      this.errorMessage =
        'Unable to load authors.';


    } finally {

      this.isLoading = false;

      this.cdr.detectChanges();

    }
  }


  searchAuthors(): void {

    const value =
      this.searchTerm
        .trim()
        .toLowerCase();


    // Empty search = show all writers
    if (!value) {

      this.filteredAuthors =
        [...this.authors];

      return;
    }


    // Search by writer name
    this.filteredAuthors =
      this.authors.filter(
        author =>
          author.name
            .toLowerCase()
            .includes(value)
      );


  }

  openAuthor(
  authorId: string
): void {

  this.router.navigate([
    '/authors',
    authorId
  ]);
}
}