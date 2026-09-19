import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ArticleService }
  from '../../../core/services/article';

import { Article }
  from '../../../shared/models/article.model';

import { ArticleCard }
  from '../../../shared/components/article-card/article-card';


@Component({
  selector: 'app-home',

  imports: [
    FormsModule,
    ArticleCard
  ],

  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  // All published articles
  articles: Article[] = [];

  // Search/sort result
  filteredArticles: Article[] = [];

  searchTerm = '';

  sortBy = 'latest';

  isLoading = true;

  errorMessage = '';

  // Pagination
  currentPage = 1;

  pageSize = 6;

    // Web Worker
  private searchWorker?: Worker;


  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  //================
  // Web Worker
  //================
    private initializeSearchWorker(): void {

  if (typeof Worker === 'undefined') {

    console.warn(
      'Web Workers are not supported in this browser.'
    );

    return;
  }


  this.searchWorker =
    new Worker(
      new URL(
        './article-search.worker',
        import.meta.url
      )
    );


  this.searchWorker.onmessage =
    ({ data }) => {

      this.filteredArticles =
        data as Article[];

      this.currentPage = 1;

      this.sortArticles();

      this.cdr.detectChanges();
    };


  this.searchWorker.onerror =
    (error) => {

      console.error(
        'Article search worker error:',
        error
      );
    };
}

   // =====================================
  // INIT
  // =====================================

  async ngOnInit(): Promise<void> {
     // Start Web Worker
    this.initializeSearchWorker();
    try {

     // First check whether any scheduled
// article is ready to publish
await this.articleService
  .publishScheduledArticles();


// Then load published articles
this.articles =
  await this.articleService
    .getPublishedArticles();

      this.filteredArticles =
        [...this.articles];

      // Default sorting
      this.sortArticles();

    } catch (error) {

      console.error(
        'Error loading articles:',
        error
      );

      this.errorMessage =
        'Unable to load articles. Please try again.';

    } finally {

      this.isLoading = false;

      this.cdr.detectChanges();
    }
  }


  // =====================================
  // FEATURED ARTICLE
  // =====================================

  get featuredArticle(): Article | null {

    if (this.articles.length === 0) {
      return null;
    }

    // For now the latest published article
    // is displayed as featured.
    return [...this.articles]
      .sort(
        (a, b) =>
          (b.publishedAt?.getTime() ?? 0) -
          (a.publishedAt?.getTime() ?? 0)
      )[0];
  }


  // =====================================
  // SEARCH
  // =====================================

  searchArticles(): void {

  const searchValue =
    this.searchTerm
      .trim()
      .toLowerCase();


  // Use Web Worker when available
  if (this.searchWorker) {

    this.searchWorker.postMessage({

      articles:
        this.articles,

      searchTerm:
        searchValue

    });

    return;
  }


  // Fallback if Web Worker
  // is unavailable
  this.filteredArticles =
    this.articles.filter(article => {

      const title =
        article.title
          ?.toLowerCase() ?? '';

      const author =
        article.authorName
          ?.toLowerCase() ?? '';

      const description =
        article.description
          ?.toLowerCase() ?? '';

      const content =
        article.content
          ?.toLowerCase() ?? '';


      return (
        !searchValue ||
        title.includes(searchValue) ||
        author.includes(searchValue) ||
        description.includes(searchValue) ||
        content.includes(searchValue)
      );

    });


  this.currentPage = 1;

  this.sortArticles();
}


  // =====================================
  // SORT
  // =====================================

  sortArticles(): void {

    if (this.sortBy === 'latest') {

      this.filteredArticles.sort(
        (a, b) =>
          (b.publishedAt?.getTime() ?? 0) -
          (a.publishedAt?.getTime() ?? 0)
      );

    } else if (this.sortBy === 'oldest') {

      this.filteredArticles.sort(
        (a, b) =>
          (a.publishedAt?.getTime() ?? 0) -
          (b.publishedAt?.getTime() ?? 0)
      );
    }


    this.currentPage = 1;
  }


  // =====================================
  // PAGINATION
  // =====================================

  get paginatedArticles(): Article[] {

    const startIndex =
      (this.currentPage - 1) *
      this.pageSize;

    return this.filteredArticles.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }


  get totalPages(): number {

    return Math.ceil(
      this.filteredArticles.length /
      this.pageSize
    );
  }


  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }


  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}