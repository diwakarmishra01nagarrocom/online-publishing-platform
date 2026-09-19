import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { ArticleService }
  from '../../../core/services/article';

import { CommentService }
  from '../../../core/services/comment';

import { UserService }
  from '../../../core/services/user';

import { firebaseAuth }
  from '../../../core/firebase/firebase.config';

import { Article }
  from '../../../shared/models/article.model';

import { ArticleComment }
  from '../../../shared/models/comment.model';

import { AppUser }
  from '../../../shared/models/user.model';

import { ArticleCard }
  from '../../../shared/components/article-card/article-card';


@Component({
  selector: 'app-article-details',

  imports: [
    FormsModule,
    ArticleCard
  ],

  templateUrl: './article-details.html',
  styleUrl: './article-details.scss'
})
export class ArticleDetails implements OnInit {

  // Current article
  article: Article | null = null;

  // Writer profile
  author: AppUser | null = null;

  // Other articles by same writer
  authorArticles: Article[] = [];

  // All comments including replies
  comments: ArticleComment[] = [];

  commentSortBy = 'newest';

  isLoading = true;

  errorMessage = '';


  // ==============================
  // MAIN COMMENT
  // ==============================

  commentText = '';

  isPostingComment = false;

  commentSuccessMessage = '';

  commentErrorMessage = '';


  // ==============================
  // REPLY
  // ==============================

  replyingToCommentId: string | null = null;

  replyText = '';

  isPostingReply = false;


  // ==============================
  // LIKE
  // ==============================

  likingCommentId: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private commentService: CommentService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}


  async ngOnInit(): Promise<void> {

    const articleId =
      this.route.snapshot.paramMap.get('id');


    if (!articleId) {

      this.errorMessage =
        'Article not found.';

      this.isLoading = false;

      return;
    }


    try {

      // Load article
      this.article =
        await this.articleService
          .getArticleById(articleId);


      if (!this.article) {

        this.errorMessage =
          'Article not found.';

        return;
      }


      // Load writer profile
      this.author =
        await this.userService.getUser(
          this.article.authorId
        );


      // Load comments
      await this.loadComments();


      // Load published articles
      const publishedArticles =
        await this.articleService
          .getPublishedArticles();


      // Other articles by SAME writer
      this.authorArticles =
        publishedArticles
          .filter(
            article =>
              article.id !== articleId &&
              article.authorId ===
                this.article?.authorId
          )
          .slice(0, 3);


    } catch (error) {

      console.error(
        'Error loading article:',
        error
      );

      this.errorMessage =
        'Unable to load the article.';


    } finally {

      this.isLoading = false;

      this.cdr.detectChanges();
    }
  }


  // ==============================
  // LOAD COMMENTS
  // ==============================

  async loadComments(): Promise<void> {

    if (!this.article?.id) {
      return;
    }


    this.comments =
      await this.commentService
        .getComments(
          this.article.id
        );
  }


  // ==============================
  // MAIN COMMENTS
  // ==============================

  get mainComments(): ArticleComment[] {

    const mainComments =
      this.comments.filter(
        comment =>
          comment.parentCommentId === null
      );

    return this.sortCommentList(
      mainComments
    );
  }


  // ==============================
  // SORT COMMENTS
  // ==============================

  private sortCommentList(
    comments: ArticleComment[]
  ): ArticleComment[] {

    const sortedComments =
      [...comments];


    if (
      this.commentSortBy === 'oldest'
    ) {

      return sortedComments.sort(
        (a, b) => {

          const dateA =
            a.createdAt?.getTime() ?? 0;

          const dateB =
            b.createdAt?.getTime() ?? 0;

          return dateA - dateB;
        }
      );
    }


    if (
      this.commentSortBy === 'mostLiked'
    ) {

      return sortedComments.sort(
        (a, b) =>
          (b.likeCount ?? 0) -
          (a.likeCount ?? 0)
      );
    }


    // Default = newest
    return sortedComments.sort(
      (a, b) => {

        const dateA =
          a.createdAt?.getTime() ?? 0;

        const dateB =
          b.createdAt?.getTime() ?? 0;

        return dateB - dateA;
      }
    );
  }


  // ==============================
  // GET REPLIES
  // ==============================

  getReplies(
    commentId: string | undefined
  ): ArticleComment[] {

    if (!commentId) {
      return [];
    }


    return this.comments.filter(
      comment =>
        comment.parentCommentId ===
          commentId
    );
  }


  // ==============================
  // POST COMMENT
  // ==============================

  async postComment(): Promise<void> {

    const user =
      firebaseAuth.currentUser;


    if (!user) {

      this.commentErrorMessage =
        'Please login to post a comment.';

      return;
    }


    if (!this.article?.id) {

      this.commentErrorMessage =
        'Article not found.';

      return;
    }


    const content =
      this.commentText.trim();


    if (!content) {

      this.commentErrorMessage =
        'Please enter a comment.';

      return;
    }


    try {

      this.isPostingComment = true;

      this.commentSuccessMessage = '';

      this.commentErrorMessage = '';


      await this.commentService.addComment({

        articleId:
          this.article.id,

        userId:
          user.uid,

        userName:
          user.displayName ?? 'User',

        userPhotoUrl:
          user.photoURL ?? '',

        content:
          content,

        parentCommentId:
          null,

        likeCount:
          0
      });


      this.commentText = '';


      await this.loadComments();


      this.commentSuccessMessage =
        'Comment posted successfully.';


    } catch (error) {

      console.error(
        'Error posting comment:',
        error
      );


      this.commentErrorMessage =
        'Unable to post comment. Please try again.';


    } finally {

      this.isPostingComment = false;

      this.cdr.detectChanges();
    }
  }


  // ==============================
  // START REPLY
  // ==============================

  startReply(
    commentId: string | undefined
  ): void {

    if (!commentId) {
      return;
    }


    this.replyingToCommentId =
      commentId;

    this.replyText = '';
  }


  // ==============================
  // CANCEL REPLY
  // ==============================

  cancelReply(): void {

    this.replyingToCommentId =
      null;

    this.replyText = '';
  }


  // ==============================
  // POST REPLY
  // ==============================

  async postReply(
    parentCommentId:
      string | undefined
  ): Promise<void> {

    const user =
      firebaseAuth.currentUser;


    if (!user) {

      this.commentErrorMessage =
        'Please login to reply.';

      return;
    }


    if (!this.article?.id) {
      return;
    }


    if (!parentCommentId) {
      return;
    }


    const content =
      this.replyText.trim();


    if (!content) {

      this.commentErrorMessage =
        'Please enter a reply.';

      return;
    }


    try {

      this.isPostingReply = true;

      this.commentErrorMessage = '';

      this.commentSuccessMessage = '';


      await this.commentService.addComment({

        articleId:
          this.article.id,

        userId:
          user.uid,

        userName:
          user.displayName ?? 'User',

        userPhotoUrl:
          user.photoURL ?? '',

        content:
          content,

        parentCommentId:
          parentCommentId,

        likeCount:
          0
      });


      this.replyText = '';

      this.replyingToCommentId =
        null;


      await this.loadComments();


      this.commentSuccessMessage =
        'Reply posted successfully.';


    } catch (error) {

      console.error(
        'Error posting reply:',
        error
      );


      this.commentErrorMessage =
        'Unable to post reply.';


    } finally {

      this.isPostingReply = false;

      this.cdr.detectChanges();
    }
  }


  // ==============================
  // LIKE COMMENT
  // ==============================

  async likeComment(
    commentId: string | undefined
  ): Promise<void> {

    if (!commentId) {
      return;
    }


    try {

      this.likingCommentId =
        commentId;


      await this.commentService
        .likeComment(commentId);


      await this.loadComments();


    } catch (error) {

      console.error(
        'Error liking comment:',
        error
      );


      this.commentErrorMessage =
        'Unable to like comment.';


    } finally {

      this.likingCommentId =
        null;

      this.cdr.detectChanges();
    }
  }


  // ==============================
  // BACK
  // ==============================

  goBack(): void {

    this.router.navigate([
      '/home'
    ]);
  }
}