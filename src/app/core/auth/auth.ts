import { Injectable, signal } from '@angular/core';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
  UserCredential
} from 'firebase/auth';

import { firebaseAuth } from '../firebase/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly currentUserSignal = signal<User | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    onAuthStateChanged(firebaseAuth, (user) => {
      this.currentUserSignal.set(user);
    });
  }

 async loginWithGoogle(): Promise<UserCredential> {

  const provider = new GoogleAuthProvider();

  // Always allow user to choose a Google account
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  return signInWithPopup(
    firebaseAuth,
    provider
  );
}

  async logout(): Promise<void> {
    return signOut(firebaseAuth);
  }
}