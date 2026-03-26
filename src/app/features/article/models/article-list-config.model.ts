/**
 * Configuration object for querying a list of articles.
 * Passed to {@link ArticlesService.query} and consumed by {@link ArticleListComponent}.
 */
export interface ArticleListConfig {
  /** 'all' for the global feed, 'feed' for the authenticated user's following feed. */
  type: string;

  /** Optional filters applied as query parameters to the API request. */
  filters: {
    /** Filter articles by tag name. */
    tag?: string;
    /** Filter articles written by a specific author username. */
    author?: string;
    /** Filter articles favorited by a specific username. */
    favorited?: string;
    /** Maximum number of articles to return (pagination page size). */
    limit?: number;
    /** Number of articles to skip (pagination offset). */
    offset?: number;
  };
}
