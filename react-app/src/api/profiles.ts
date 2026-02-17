import type { Profile } from '../types';
import { del, get, post } from './client';

export function getProfile(username: string): Promise<{ profile: Profile }> {
  return get<{ profile: Profile }>(`/profiles/${username}`);
}

export function followUser(username: string): Promise<{ profile: Profile }> {
  return post<{ profile: Profile }>(`/profiles/${username}/follow`);
}

export function unfollowUser(username: string): Promise<{ profile: Profile }> {
  return del<{ profile: Profile }>(`/profiles/${username}/follow`);
}
