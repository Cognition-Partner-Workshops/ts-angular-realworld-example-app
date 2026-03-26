import { Profile } from '../../profile/models/profile.model';

/** Represents a single article as returned by the RealWorld API. */
export interface Article {
  /** URL-friendly unique identifier used in routes (e.g. '/article/:slug'). */
  slug: string;
  /** Article headline displayed in lists and detail views. */
  title: string;
  /** Short summary shown in article preview cards. */
  description: string;
  /** Full article content, may contain markdown. */
  body: string;
  /** User-assigned tags for categorization and discovery. */
  tagList: string[];
  /** ISO 8601 timestamp of when the article was first published. */
  createdAt: string;
  /** ISO 8601 timestamp of the most recent edit. */
  updatedAt: string;
  /** Whether the current user has favorited this article. */
  favorited: boolean;
  /** Total number of users who have favorited this article. */
  favoritesCount: number;
  /** Public profile of the article's author. */
  author: Profile;
}
