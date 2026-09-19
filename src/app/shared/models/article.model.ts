export type ArticleStatus =
  'draft' |
  'published' |
  'scheduled';


export interface Article {

  id?: string;

  title: string;

  description: string;

  content: string;

  thumbnailUrl?: string;

  authorId: string;

  authorName: string;

  status: ArticleStatus;

  createdAt: Date;

  updatedAt: Date;

  publishedAt?: Date;

  scheduledAt?: Date;


  // Number of times article was opened
  viewCount?: number;


  // Article selected as Editor's Pick
  isEditorsPick?: boolean;

}