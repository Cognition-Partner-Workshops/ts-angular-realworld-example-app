import { Profile } from '../../profile/models/profile.model';

/** A comment on an article, displayed beneath the article body. */
export interface Comment {
  /** Unique identifier used for deletion. */
  id: string;
  /** The comment text content. */
  body: string;
  /** ISO 8601 timestamp of when the comment was posted. */
  createdAt: string;
  /** Public profile of the commenter. */
  author: Profile;
}
