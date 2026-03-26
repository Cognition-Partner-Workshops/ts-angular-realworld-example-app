import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../models/comment.model';

/**
 * HTTP service for managing comments on articles.
 * Comments are scoped to a specific article identified by its slug.
 */
@Injectable({ providedIn: 'root' })
export class CommentsService {
  constructor(private readonly http: HttpClient) {}

  /** Fetches all comments for the given article, ordered newest-first by the API. */
  getAll(slug: string): Observable<Comment[]> {
    return this.http.get<{ comments: Comment[] }>(`/articles/${slug}/comments`).pipe(map(data => data.comments));
  }

  /** Posts a new comment on the specified article and returns the created comment. */
  add(slug: string, payload: string): Observable<Comment> {
    return this.http
      .post<{ comment: Comment }>(`/articles/${slug}/comments`, {
        comment: { body: payload },
      })
      .pipe(map(data => data.comment));
  }

  /** Deletes a comment by ID. Only the comment author can perform this action. */
  delete(commentId: string, slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}/comments/${commentId}`);
  }
}
