import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-writer-dashboard',
  imports: [],
  templateUrl: './writer-dashboard.html',
  styleUrl: './writer-dashboard.scss'
})
export class WriterDashboard {

  constructor(
    private router: Router
  ) {}


  createPost(): void {

    this.router.navigate([
      '/writer/create'
    ]);
  }


  viewArticles(): void {

    this.router.navigate([
      '/home'
    ]);
  }
}