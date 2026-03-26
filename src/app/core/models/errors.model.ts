/**
 * Standard error response shape returned by the RealWorld API.
 * Keys are field names (e.g. 'email', 'password') and values are error messages.
 * Used by {@link ListErrorsComponent} to render validation feedback.
 */
export interface Errors {
  errors: { [key: string]: string };
}
