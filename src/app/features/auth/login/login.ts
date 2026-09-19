import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService }
  from '../../../core/auth/auth';

import { UserService }
  from '../../../core/services/user';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  isLoading = false;

  errorMessage = '';


  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}


  async loginWithGoogle(): Promise<void> {

    try {

      this.isLoading = true;

      this.errorMessage = '';


      // 1. Login with Google
      const result =
        await this.authService
          .loginWithGoogle();


      console.log(
        'Logged in user:',
        result.user
      );


      // 2. Check user profile in Firestore
      const appUser =
        await this.userService
          .getUser(result.user.uid);


      // 3. New user - profile does not exist
      if (!appUser) {

        await this.router.navigate([
          '/complete-profile'
        ]);

        return;
      }


      // 4. Existing Writer
      if (appUser.role === 'writer') {

        await this.router.navigate([
          '/writer'
        ]);

        return;
      }


      // 5. Existing Reader
      await this.router.navigate([
        '/home'
      ]);


    } catch (error) {

      console.error(
        'Google login failed:',
        error
      );


      this.errorMessage =
        'Unable to login with Google. Please try again.';


    } finally {

      this.isLoading = false;

    }
  }
}