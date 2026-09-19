import { Injectable } from '@angular/core';

import {
  addDoc,
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
  doc,
  getDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';

import { Article }
  from '../../shared/models/article.model';

import { firebaseApp }
  from '../firebase/firebase.config';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private readonly firestore: Firestore;

  private readonly articlesCollection:
    CollectionReference<DocumentData>;


  constructor() {

    // Connect to Cloud Firestore
    this.firestore =
      getFirestore(firebaseApp);


    // Reference to "articles" collection
    this.articlesCollection =
      collection(
        this.firestore,
        'articles'
      );
  }


  // ==========================================
  // CREATE ARTICLE
  // Used for Draft, Publish and Schedule
  // ==========================================

  async createArticle(
    article: Omit<
      Article,
      'id' | 'createdAt' | 'updatedAt'
    >
  ): Promise<string> {

    const documentReference =
      await addDoc(
        this.articlesCollection,
        {
          ...article,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp()
        }
      );


    // Return generated Firestore document ID
    return documentReference.id;
  }


  // ==========================================
  // PUBLISH SCHEDULED ARTICLES
  // ==========================================

  async publishScheduledArticles():
    Promise<void> {

    const now =
      Timestamp.now();


    // Find scheduled articles where
    // scheduled publication time has passed
    const scheduledQuery =
      query(

        this.articlesCollection,

        where(
          'status',
          '==',
          'scheduled'
        ),

        where(
          'scheduledAt',
          '<=',
          now
        )
      );


    const querySnapshot =
      await getDocs(
        scheduledQuery
      );


    // Nothing needs publishing
    if (querySnapshot.empty) {

      return;
    }


    // Update all matching articles
    const updatePromises =
      querySnapshot.docs.map(
        articleDocument => {

          const articleReference =
            doc(
              this.firestore,
              'articles',
              articleDocument.id
            );


          return updateDoc(
            articleReference,
            {
              status:
                'published',

              publishedAt:
                serverTimestamp(),

              updatedAt:
                serverTimestamp()
            }
          );

        }
      );


    await Promise.all(
      updatePromises
    );


    console.log(
      `${querySnapshot.size} scheduled article(s) published.`
    );
  }


  // ==========================================
  // GET PUBLISHED ARTICLES
  // Reader Home Page
  // ==========================================

  async getPublishedArticles():
    Promise<Article[]> {

    const publishedQuery =
      query(
        this.articlesCollection,

        where(
          'status',
          '==',
          'published'
        )
      );


    const querySnapshot =
      await getDocs(
        publishedQuery
      );


    return querySnapshot.docs.map(
      document => {

        const data =
          document.data();


        return {

          id:
            document.id,

          title:
            data['title'],

          description:
            data['description'],

          content:
            data['content'],

          thumbnailUrl:
            data['thumbnailUrl'],

          authorId:
            data['authorId'],

          authorName:
            data['authorName'],

          status:
            data['status'],

          createdAt:
            data['createdAt']
              ?.toDate(),

          updatedAt:
            data['updatedAt']
              ?.toDate(),

          publishedAt:
            data['publishedAt']
              ?.toDate(),

          scheduledAt:
            data['scheduledAt']
              ?.toDate()

        } as Article;

      }
    );
  }


  // ==========================================
  // GET ARTICLE BY ID
  // ==========================================

  async getArticleById(
    articleId: string
  ): Promise<Article | null> {

    const articleReference =
      doc(
        this.firestore,
        'articles',
        articleId
      );


    const articleSnapshot =
      await getDoc(
        articleReference
      );


    // Article doesn't exist
    if (!articleSnapshot.exists()) {

      return null;
    }


    const data =
      articleSnapshot.data();


    // Reader must not access
    // Draft or Scheduled article
    if (
      data['status'] !==
      'published'
    ) {

      return null;
    }


    return {

      id:
        articleSnapshot.id,

      title:
        data['title'],

      description:
        data['description'],

      content:
        data['content'],

      thumbnailUrl:
        data['thumbnailUrl'],

      authorId:
        data['authorId'],

      authorName:
        data['authorName'],

      status:
        data['status'],

      createdAt:
        data['createdAt']
          ?.toDate(),

      updatedAt:
        data['updatedAt']
          ?.toDate(),

      publishedAt:
        data['publishedAt']
          ?.toDate(),

      scheduledAt:
        data['scheduledAt']
          ?.toDate()

    } as Article;
  }

}