import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

import { Article }
  from '../../models/article.model';

@Component({
  selector: 'app-article-card',
  imports: [],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss'
})
export class ArticleCard {

  article = input.required<Article>();

  constructor(
    private router: Router
  ) {}

  openArticle(): void {

    const articleId = this.article().id;

    if (!articleId) {
      return;
    }

    this.router.navigate([
      '/article',
      articleId
    ]);
  }
}