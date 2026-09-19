import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  firebaseAuth
} from '../../../core/firebase/firebase.config';

import {
  AuthService
} from '../../../core/auth/auth';

import {
  UserService
} from '../../../core/services/user';

import {
  AppUser
} from '../../models/user.model';


@Component({
  selector: 'app-navbar',

  imports: [
    RouterLink
  ],

  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {

  currentUser: AppUser | null = null;

  isLoading = true;


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  async ngOnInit(): Promise<void> {

    const firebaseUser =
      firebaseAuth.currentUser;


    if (!firebaseUser) {

      this.isLoading = false;

      return;
    }


    try {

      this.currentUser =
        await this.userService.getUser(
          firebaseUser.uid
        );

    } catch (error) {

      console.error(
        'Unable to load navbar user:',
        error
      );

    } finally {

      this.isLoading = false;

      this.cdr.detectChanges();
    }
  }


  get isWriter(): boolean {

    return this.currentUser?.role === 'writer';
  }


  async logout(): Promise<void> {

    try {

      await this.authService.logout();

      await this.router.navigate([
        '/login'
      ]);

    } catch (error) {

      console.error(
        'Logout failed:',
        error
      );
    }
  }
}