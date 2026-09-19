# Online Publishing Platform

An online publishing platform built using Angular and Firebase where writers can create and publish articles and readers can discover articles, interact with authors, and participate in discussions.

## Features

### Authentication
- Google authentication using Firebase Authentication
- Reader and Writer roles
- Role-based route protection
- Writer-specific pages protected using Angular route guards

### Writer Features
- Writer dashboard
- Create articles using a rich-text editor
- Save articles as drafts
- Publish articles immediately
- Schedule articles for future publication
- Article title, description, content and thumbnail URL support

### Reader Features
- Browse published articles
- Featured article section
- Search articles by title, author or keyword
- Sort articles by latest or oldest
- Pagination
- Read complete article content
- Related articles

### Authors
- Explore registered writers
- Search authors by name
- Author profile with profile picture and bio
- View articles written by an author

### Comments
- Post comments on articles
- Reply to comments
- Threaded discussions
- Like comments
- Sort comments by:
  - Newest
  - Oldest
  - Most Liked

### Web Worker
A Web Worker is used for article searching/filtering so that search processing can run separately from the main UI thread.

### Testing
Angular unit tests are included for application components and guards.

Current test result:

```text
Test Files  8 passed (8)
Tests       8 passed (8)
```

## Technologies Used

- Angular 22
- TypeScript
- SCSS
- Firebase Authentication
- Cloud Firestore
- Quill Rich Text Editor
- Angular Reactive Forms
- Angular Route Guards
- Web Workers
- Vitest

## Project Structure

```text
src/app/
├── core/
│   ├── auth/
│   ├── firebase/
│   └── services/
│
├── features/
│   ├── auth/
│   ├── reader/
│   └── writer/
│
└── shared/
    ├── components/
    └── models/
```

## Firebase Collections

The application uses the following Cloud Firestore collections:

### users
Stores user profile information including:
- Name
- Email
- Role
- Profile picture
- Author bio

### articles
Stores article information including:
- Title
- Description
- Content
- Author
- Status
- Created date
- Published date
- Scheduled publication date

Article statuses include:

```text
draft
published
scheduled
```

### comments
Stores article comments and replies including:
- Article ID
- User information
- Comment content
- Parent comment ID
- Like count
- Created date

## Running the Project Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Configure the Firebase settings in the Angular environment file.

Example:

```typescript
export const environment = {
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    appId: 'YOUR_APP_ID'
  }
};
```

Do not commit private or sensitive configuration values to a public repository.

### 3. Start the application

```bash
ng serve
```

Open the local URL displayed by Angular CLI in your browser.

## Build

Create a production build using:

```bash
ng build
```

The production files will be generated inside the `dist` directory.

## Unit Tests

Run the unit tests using:

```bash
ng test --watch=false
```

## User Roles

### Writer
Writers can:
- Create articles
- Save drafts
- Publish articles
- Schedule articles
- Access the writer dashboard

### Reader
Readers can:
- Browse published articles
- Search articles
- Read articles
- Explore authors
- Comment and reply to discussions
- Like comments

## Demo

### Live Application
To be added after deployment.

### GitHub Repository
To be added after pushing the project to GitHub.

## Notes

- Firebase Authentication is used for Google sign-in.
- Cloud Firestore is used as the application database.
- Firebase Storage is not used in the current implementation; article thumbnails can be provided using image URLs.
- Scheduled articles are published when the application checks for scheduled articles whose publication time has been reached.

## Author

Diwakar Mishra