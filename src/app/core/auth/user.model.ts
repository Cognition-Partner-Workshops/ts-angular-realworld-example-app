/**
 * Represents the authenticated user returned by the RealWorld API.
 * Contains both profile data and the JWT token for authorization.
 */
export interface User {
  /** User's email address, used for login. */
  email: string;
  /** JWT token issued by the API, stored in localStorage for session persistence. */
  token: string;
  /** Unique display name used in profile URLs and author attribution. */
  username: string;
  /** Short biography displayed on the user's profile page. */
  bio: string | null;
  /** URL of the user's avatar image; falls back to a default SVG when null. */
  image: string | null;
}
