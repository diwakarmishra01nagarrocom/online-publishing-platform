import { Injectable } from '@angular/core';

import {
 addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  getFirestore,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';

import { firebaseApp }
  from '../firebase/firebase.config';

import { ArticleComment }
  from '../../shared/models/comment.model';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly firestore: Firestore;

  private readonly commentsCollection:
    CollectionReference<DocumentData>;


  constructor() {

    this.firestore =
      getFirestore(firebaseApp);

    this.commentsCollection =
      collection(
        this.firestore,
        'comments'
      );
  }


  // Add new comment or reply
  async addComment(
    comment: Omit<
      ArticleComment,
      'id' | 'createdAt'
    >
  ): Promise<string> {

    const documentReference =
      await addDoc(
        this.commentsCollection,
        {
          ...comment,
          createdAt: serverTimestamp()
        }
      );

    return documentReference.id;
  }


  // Get all comments for one article
  async getComments(
    articleId: string
  ): Promise<ArticleComment[]> {

    const commentsQuery = query(
      this.commentsCollection,
      where('articleId', '==', articleId)
    );

    const querySnapshot =
      await getDocs(commentsQuery);


    return querySnapshot.docs.map(document => {

      const data = document.data();

      return {

        id: document.id,

        articleId:
          data['articleId'],

        userId:
          data['userId'],

        userName:
          data['userName'],

        userPhotoUrl:
          data['userPhotoUrl'],

        content:
          data['content'],

        parentCommentId:
          data['parentCommentId'],

        likeCount:
          data['likeCount'] ?? 0,

        createdAt:
          data['createdAt']?.toDate()

      } as ArticleComment;

    });
  }

  // Like comments

  async likeComment(
  commentId: string
): Promise<void> {

  const commentReference = doc(
    this.firestore,
    'comments',
    commentId
  );

  await updateDoc(
    commentReference,
    {
      likeCount: increment(1)
    }
  );
}
}