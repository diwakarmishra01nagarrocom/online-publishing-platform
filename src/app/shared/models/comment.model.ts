export interface ArticleComment {
  id?: string;

  articleId: string;

  userId: string;
  userName: string;
  userPhotoUrl?: string;

  content: string;

  // null = main comment
  // value = reply to another comment
  parentCommentId: string | null;

  likeCount: number;

  createdAt?: Date;
}