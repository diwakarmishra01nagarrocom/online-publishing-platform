import { Injectable } from '@angular/core';

import {
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  collection,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore';

import {
  AppUser,
  UserRole
} from '../../shared/models/user.model';

import { firebaseApp }
  from '../firebase/firebase.config';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly firestore: Firestore;


  constructor() {

    this.firestore =
      getFirestore(firebaseApp);

  }


  // =====================================
  // CHECK WHETHER USER PROFILE EXISTS
  // =====================================

  async getUser(
    uid: string
  ): Promise<AppUser | null> {

    const userReference = doc(
      this.firestore,
      'users',
      uid
    );

    const snapshot =
      await getDoc(userReference);


    if (!snapshot.exists()) {
      return null;
    }


    const data = snapshot.data();


    return {

      uid: snapshot.id,

      name:
        data['name'] ?? '',

      email:
        data['email'] ?? '',

      photoUrl:
        data['photoUrl'] ?? '',

      role:
        data['role'] as UserRole,

      bio:
        data['bio'] ?? '',

      createdAt:
        data['createdAt']?.toDate()

    };
  }


  // =====================================
  // CREATE / SAVE USER PROFILE
  // =====================================

  async createUser(
    user: AppUser
  ): Promise<void> {

    const userReference = doc(
      this.firestore,
      'users',
      user.uid
    );


    await setDoc(
      userReference,
      {
        uid:
          user.uid,

        name:
          user.name,

        email:
          user.email,

        photoUrl:
          user.photoUrl,

        role:
          user.role,

        bio:
          user.bio,

        createdAt:
          serverTimestamp()
      }
    );
  }


  // =====================================
  // GET ALL WRITERS / AUTHORS
  // =====================================

  async getWriters(): Promise<AppUser[]> {

    const usersCollection =
      collection(
        this.firestore,
        'users'
      );


    const writerQuery = query(
      usersCollection,
      where('role', '==', 'writer')
    );


    const snapshot =
      await getDocs(writerQuery);


    return snapshot.docs.map(document => {

      const data =
        document.data();


      return {

        uid:
          document.id,

        name:
          data['name'] ?? '',

        email:
          data['email'] ?? '',

        photoUrl:
          data['photoUrl'] ?? '',

        role:
          data['role'] as UserRole,

        bio:
          data['bio'] ?? '',

        createdAt:
          data['createdAt']?.toDate()

      } as AppUser;

    });
  }
}