import { Routes } from '@angular/router';

import { authGuard }
  from './core/auth/auth-guard';

import { writerGuard }
  from './core/auth/writer-guard';


export const routes: Routes = [

  // ==============================
  // Login
  // ==============================
  {
    path: 'login',

    loadComponent: () =>
      import(
        './features/auth/login/login'
      )
        .then(m => m.Login)
  },


  // ==============================
  // Writer Dashboard
  // Writer only
  // ==============================
  {
    path: 'writer',

    canActivate: [writerGuard],

    loadComponent: () =>
      import(
        './features/writer/writer-dashboard/writer-dashboard'
      )
        .then(m => m.WriterDashboard)
  },


  // ==============================
  // Create New Post
  // Writer only
  // ==============================
  {
    path: 'writer/create',

    canActivate: [writerGuard],

    loadComponent: () =>
      import(
        './features/writer/create-post/create-post'
      )
        .then(m => m.CreatePost)
  },


  // ==============================
  // Reader Home
  // Login required
  // ==============================
  {
    path: 'home',

  canActivate: [authGuard],

  loadComponent: () =>
    import(
      './features/reader/home/home'
    )
      .then(m => m.Home)
  },


  // ==============================
  // Article Details
  // ==============================
  {
   path: 'article/:id',

  canActivate: [authGuard],

  loadComponent: () =>
    import(
      './features/reader/article-details/article-details'
    )
      .then(m => m.ArticleDetails)
  },


  // ==============================
  // Explore Authors
  // ==============================
  {
      path: 'authors',

  canActivate: [authGuard],

  loadComponent: () =>
    import(
      './features/reader/authors/authors'
    )
      .then(m => m.Authors)
  },


  // ==============================
  // Complete User Profile
  // Must be authenticated
  // ==============================
  {
    path: 'complete-profile',

    canActivate: [authGuard],

    loadComponent: () =>
      import(
        './features/auth/complete-profile/complete-profile'
      )
        .then(m => m.CompleteProfile)
  },


  // ==============================
  // Default Route
  // ==============================
  {
    path: '',

    redirectTo: 'login',

    pathMatch: 'full'
  },

 //========================
 // author-profilr
 //==========================
 {
  path: 'authors/:id',

  canActivate: [authGuard],

  loadComponent: () =>
    import(
      './features/reader/author-profile/author-profile'
    )
      .then(m => m.AuthorProfile)
},


  // ==============================
  // Invalid URL
  // ==============================
  {
    path: '**',

    redirectTo: 'login'
  }

];