import { Injectable } from '@angular/core';

/**
 * Manages JWT token persistence in localStorage.
 *
 * All authentication state flows through this service for token storage.
 * The token is stored under the key 'jwtToken' and is read on app startup
 * by {@link initAuth} to validate the session.
 */
@Injectable({ providedIn: 'root' })
export class JwtService {
  /** Retrieves the stored JWT token, or undefined if none exists. */
  getToken(): string {
    return window.localStorage['jwtToken'];
  }

  /** Persists the JWT token to localStorage for use across page reloads. */
  saveToken(token: string): void {
    window.localStorage['jwtToken'] = token;
  }

  /** Removes the JWT token from localStorage, effectively ending the session. */
  destroyToken(): void {
    window.localStorage.removeItem('jwtToken');
  }
}
