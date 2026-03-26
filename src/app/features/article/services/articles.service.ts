import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticleListConfig } from '../models/article-list-config.model';
import { Article } from '../models/article.model';

/**
 * HTTP service for article CRUD operations and favoriting.
 * All endpoints are relative to /articles and are prefixed by {@link apiInterceptor}.
 */
@Injectable({ providedIn: 'root' })
export class ArticlesService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches a paginated list of articles matching the given configuration.
   * Uses /articles for the global feed or /articles/feed for the following feed.
   */
  query(config: ArticleListConfig): Observable<{ articles: Article[]; articlesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    let params = new HttpParams();

    Object.keys(config.filters).forEach(key => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });

    return this.http.get<{ articles: Article[]; articlesCount: number }>(
      '/articles' + (config.type === 'feed' ? '/feed' : ''),
      { params },
    );
  }

  /** Fetches a single article by its URL slug. */
  get(slug: string): Observable<Article> {
    return this.http.get<{ article: Article }>(`/articles/${slug}`).pipe(map(data => data.article));
  }

  /** Deletes an article. Only the author can perform this action. */
  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}`);
  }

  /** Creates a new article and returns the created article with its generated slug. */
  create(article: Partial<Article>): Observable<Article> {
    return this.http.post<{ article: Article }>('/articles/', { article: article }).pipe(map(data => data.article));
  }

  /** Updates an existing article identified by its slug. */
  update(article: Partial<Article>): Observable<Article> {
    return this.http
      .put<{ article: Article }>(`/articles/${article.slug}`, {
        article: article,
      })
      .pipe(map(data => data.article));
  }

  /** Marks an article as favorited by the current user and returns the updated article. */
  favorite(slug: string): Observable<Article> {
    return this.http.post<{ article: Article }>(`/articles/${slug}/favorite`, {}).pipe(map(data => data.article));
  }

  /** Removes the current user's favorite from an article. */
  unfavorite(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}/favorite`);
  }
}
