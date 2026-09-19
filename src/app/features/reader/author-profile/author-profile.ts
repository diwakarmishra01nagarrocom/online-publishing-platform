import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { UserService }
  from '../../../core/services/user';

import { ArticleService }
  from '../../../core/services/article';

import { AppUser }
  from '../../../shared/models/user.model';

import { Article }
  from '../../../shared/models/article.model';

import { ArticleCard }
  from '../../../shared/components/article-card/article-card';


@Component({
  selector: 'app-author-profile',

  imports: [
    ArticleCard
  ],

  templateUrl: './author-profile.html',
  styleUrl: './author-profile.scss'
})
export class AuthorProfile implements OnInit {

  author: AppUser | null = null;

  articles: Article[] = [];

  isLoading = true;

  errorMessage = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}


  async ngOnInit(): Promise<void> {

    const authorId =
      this.route.snapshot.paramMap.get('id');


    if (!authorId) {

      this.errorMessage =
        'Author not found.';

      this.isLoading = false;

      return;
    }


    try {

      // Load author profile
      this.author =
        await this.userService
          .getUser(authorId);


      // User must exist and must be Writer
      if (
        !this.author ||
        this.author.role !== 'writer'
      ) {

        this.errorMessage =
          'Author not found.';

        return;
      }


      // Load published articles
      const publishedArticles =
        await this.articleService
          .getPublishedArticles();


      // Only this author's articles
      this.articles =
        publishedArticles.filter(
          article =>
            article.authorId === authorId
        );


    } catch (error) {

      console.error(
        'Error loading author profile:',
        error
      );


      this.errorMessage =
        'Unable to load author profile.';


    } finally {

      this.isLoading = false;

      this.cdr.detectChanges();

    }
  }


  goBack(): void {

    this.router.navigate([
      '/authors'
    ]);

  }

}