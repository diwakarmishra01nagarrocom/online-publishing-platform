import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  onAuthStateChanged
} from 'firebase/auth';

import {
  firebaseAuth
} from '../firebase/firebase.config';

import {
  UserService
} from '../services/user';


export const writerGuard: CanActivateFn = () => {

  const router = inject(Router);

  const userService = inject(UserService);


  return new Promise<
    boolean | ReturnType<Router['createUrlTree']>
  >(
    (resolve) => {

      const unsubscribe =
        onAuthStateChanged(
          firebaseAuth,

          async (firebaseUser) => {

            unsubscribe();


            // User is not logged in
            if (!firebaseUser) {

              resolve(
                router.createUrlTree([
                  '/login'
                ])
              );

              return;
            }


            try {

              // Get user profile from Firestore
              const appUser =
                await userService.getUser(
                  firebaseUser.uid
                );


              // Logged in with Google,
              // but profile is not created yet
              if (!appUser) {

                resolve(
                  router.createUrlTree([
                    '/complete-profile'
                  ])
                );

                return;
              }


              // Writer is allowed
              if (appUser.role === 'writer') {

                resolve(true);

                return;
              }


              // Reader cannot access writer pages
              resolve(
                router.createUrlTree([
                  '/home'
                ])
              );


            } catch (error) {

              console.error(
                'Writer guard error:',
                error
              );

              resolve(
                router.createUrlTree([
                  '/login'
                ])
              );
            }
          }
        );
    }
  );
};