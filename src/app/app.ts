import {
  Component,
  signal
} from '@angular/core';

import {
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import { filter } from 'rxjs';

import { Navbar }
  from './shared/components/navbar/navbar';


@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet,
    Navbar
  ],

  templateUrl: './app.html',

  styleUrl: './app.scss'
})
export class App {

  protected readonly title =
    signal('online-publishing-platform');


  showNavbar = false;


  constructor(
    private router: Router
  ) {

    // Check initial URL
    this.updateNavbarVisibility(
      this.router.url
    );


    // Check whenever route changes
    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(
        event => {

          const navigationEvent =
            event as NavigationEnd;

          this.updateNavbarVisibility(
            navigationEvent.urlAfterRedirects
          );
        }
      );
  }


  private updateNavbarVisibility(
    url: string
  ): void {

    // Pages where navbar should NOT appear
    const hiddenRoutes = [
      '/login',
      '/complete-profile'
    ];


    this.showNavbar =
      !hiddenRoutes.some(
        route =>
          url.startsWith(route)
      );
  }
}