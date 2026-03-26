import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';

/**
 * Profile feature routes, lazy-loaded from the main app routes.
 * Renders {@link ProfileComponent} as the parent layout with child tabs
 * for authored articles (default) and favorited articles.
 */
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':username',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadComponent: () => import('./components/profile-articles.component'),
          },
          {
            path: 'favorites',
            loadComponent: () => import('./components/profile-favorites.component'),
          },
        ],
      },
    ],
  },
];

export default routes;
