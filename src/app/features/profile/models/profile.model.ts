/**
 * Public profile data for any user, fetched via GET /profiles/:username.
 * Unlike {@link User}, this does not include authentication details (email, token).
 */
export interface Profile {
  /** Unique display name, also used in profile route URLs. */
  username: string;
  /** Short biography displayed on the profile page. */
  bio: string | null;
  /** Avatar image URL; null falls back to a default image via {@link DefaultImagePipe}. */
  image: string | null;
  /** Whether the currently authenticated user is following this profile. */
  following: boolean;
}
