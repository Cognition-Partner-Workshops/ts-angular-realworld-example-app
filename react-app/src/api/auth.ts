import type { User } from '../types';
import { get, post } from './client';

export function login(credentials: { email: string; password: string }): Promise<{ user: User }> {
  return post<{ user: User }>('/users/login', { user: credentials });
}

export function register(credentials: { username: string; email: string; password: string }): Promise<{ user: User }> {
  return post<{ user: User }>('/users', { user: credentials });
}

export function getCurrentUser(): Promise<{ user: User }> {
  return get<{ user: User }>('/user');
}
