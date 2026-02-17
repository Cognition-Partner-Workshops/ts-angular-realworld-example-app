import type { Comment } from '../types';
import { del, get, post } from './client';

export function getComments(slug: string): Promise<{ comments: Comment[] }> {
  return get<{ comments: Comment[] }>(`/articles/${slug}/comments`);
}

export function addComment(slug: string, body: string): Promise<{ comment: Comment }> {
  return post<{ comment: Comment }>(`/articles/${slug}/comments`, {
    comment: { body },
  });
}

export function deleteComment(slug: string, commentId: string): Promise<void> {
  return del<void>(`/articles/${slug}/comments/${commentId}`);
}
