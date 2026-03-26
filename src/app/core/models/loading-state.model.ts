/**
 * Tracks the lifecycle of an async data fetch.
 * Used by components like {@link ArticleListComponent} to show loading spinners
 * and empty-state messages at the right time.
 */
export enum LoadingState {
  /** Initial state before any request has been made. */
  NOT_LOADED = 'NOT_LOADED',
  /** A request is currently in flight. */
  LOADING = 'LOADING',
  /** The request completed and results are available. */
  LOADED = 'LOADED',
}
