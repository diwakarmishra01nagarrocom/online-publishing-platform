import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  firebaseAuth
} from '../../../core/firebase/firebase.config';

import {
  UserService
} from '../../../core/services/user';

import {
  UserRole
} from '../../../shared/models/user.model';


@Component({
  selector: 'app-complete-profile',

  imports: [
    FormsModule
  ],

  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.scss'
})
export class CompleteProfile implements OnInit {

  name = '';

  email = '';

  photoUrl = '';

  bio = '';

  role: UserRole = 'reader';

  isSaving = false;

  errorMessage = '';


  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    const user =
      firebaseAuth.currentUser;


    if (!user) {

      this.router.navigate(['/login']);

      return;
    }


    // Pre-fill information from Google
    this.name =
      user.displayName ?? '';

    this.email =
      user.email ?? '';

    this.photoUrl =
      user.photoURL ?? '';
  }


  async saveProfile(): Promise<void> {

    const firebaseUser =
      firebaseAuth.currentUser;


    if (!firebaseUser) {

      this.router.navigate(['/login']);

      return;
    }


    if (!this.name.trim()) {

      this.errorMessage =
        'Name is required.';

      return;
    }


    if (
      this.role === 'writer' &&
      !this.bio.trim()
    ) {

      this.errorMessage =
        'Please enter a short bio for your writer profile.';

      return;
    }


    try {

      this.isSaving = true;

      this.errorMessage = '';


      await this.userService.createUser({

        uid:
          firebaseUser.uid,

        name:
          this.name.trim(),

        email:
          this.email,

        photoUrl:
          this.photoUrl,

        role:
          this.role,

        bio:
          this.role === 'writer'
            ? this.bio.trim()
            : ''

      });


      // Redirect based on selected role

      if (this.role === 'writer') {

        await this.router.navigate([
          '/writer'
        ]);

      } else {

        await this.router.navigate([
          '/home'
        ]);

      }


    } catch (error) {

      console.error(
        'Error saving profile:',
        error
      );

      this.errorMessage =
        'Unable to save profile. Please try again.';


    } finally {

      this.isSaving = false;

      this.cdr.detectChanges();

    }
  }
}