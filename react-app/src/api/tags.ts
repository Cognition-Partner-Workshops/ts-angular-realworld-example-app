import { get } from './client';

export function getTags(): Promise<{ tags: string[] }> {
  return get<{ tags: string[] }>('/tags');
}
