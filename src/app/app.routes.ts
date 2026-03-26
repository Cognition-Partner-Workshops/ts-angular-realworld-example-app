import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './core/auth/services/user.service';
import { map } from 'rxjs/operators';

/**
 * Guard that requires authentication. Redirects to /login if not authenticated.
 */
const requireAuth = () => {
  const router = inject(Router);
  return inject(UserService).isAuthenticated.pipe(map(isAuth => isAuth || router.createUrlTree(['/login'])));
};

/**
 * Application route definitions.
 *
 * All feature components are lazy-loaded via dynamic imports for code splitting.
 * Authentication guards protect routes that require login (settings, editor)
 * and prevent already-authenticated users from visiting login/register.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/article/pages/home/home.component'),
  },
  {
    path: 'tag/:tag',
    loadComponent: () => import('./features/article/pages/home/home.component'),
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/auth.component'),
    canActivate: [() => inject(UserService).isAuthenticated.pipe(map(isAuth => !isAuth))],
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/auth.component'),
    canActivate: [() => inject(UserService).isAuthenticated.pipe(map(isAuth => !isAuth))],
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component'),
    canActivate: [requireAuth],
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes'),
  },
  {
    path: 'editor',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/article/pages/editor/editor.component'),
        canActivate: [requireAuth],
      },
      {
        path: ':slug',
        loadComponent: () => import('./features/article/pages/editor/editor.component'),
        canActivate: [requireAuth],
      },
    ],
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('./features/article/pages/article/article.component'),
  },
];
