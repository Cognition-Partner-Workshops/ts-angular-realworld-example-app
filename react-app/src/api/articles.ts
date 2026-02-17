import type { Article, ArticleListConfig } from '../types';
import { del, get, post } from './client';

export function listArticles(config: ArticleListConfig): Promise<{ articles: Article[]; articlesCount: number }> {
  const endpoint = config.type === 'feed' ? '/articles/feed' : '/articles';
  const params = new URLSearchParams();

  if (config.filters.tag) params.set('tag', config.filters.tag);
  if (config.filters.author) params.set('author', config.filters.author);
  if (config.filters.favorited) params.set('favorited', config.filters.favorited);
  if (config.filters.limit !== undefined) params.set('limit', String(config.filters.limit));
  if (config.filters.offset !== undefined) params.set('offset', String(config.filters.offset));

  const query = params.toString();
  return get<{ articles: Article[]; articlesCount: number }>(query ? `${endpoint}?${query}` : endpoint);
}

export function getArticle(slug: string): Promise<{ article: Article }> {
  return get<{ article: Article }>(`/articles/${slug}`);
}

export function deleteArticle(slug: string): Promise<void> {
  return del<void>(`/articles/${slug}`);
}

export function favoriteArticle(slug: string): Promise<{ article: Article }> {
  return post<{ article: Article }>(`/articles/${slug}/favorite`);
}

export function unfavoriteArticle(slug: string): Promise<void> {
  return del<void>(`/articles/${slug}/favorite`);
}
