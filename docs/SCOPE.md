# SCOPE.md - Angular-to-React Migration MVP

## Objective

Deliver a React "after" app that runs side-by-side with the existing Angular "before" app on separate localhost ports, demonstrating feature parity across 2-3 meaningful user flows.

## Source Angular App

- **Repo**: `Cognition-Partner-Workshops/ts-angular-realworld-example-app`
- **Framework**: Angular 21 (standalone components, signals, RxJS)
- **API backend**: `https://api.realworld.show/api` (shared Conduit backend)
- **Dev server port**: `4200`

The Angular app is **kept intact as the baseline**. All React work lives under `react-app/`.

---

## MVP Parity Features (React)

### 1. Auth (real, token persists on refresh)

| Feature                                                 | Angular Source                          | React Target                        |
| ------------------------------------------------------- | --------------------------------------- | ----------------------------------- |
| Login (`POST /users/login`)                             | `auth.component.ts` + `user.service.ts` | `LoginPage.tsx` + `useAuth` hook    |
| Register (`POST /users`)                                | `auth.component.ts` + `user.service.ts` | `RegisterPage.tsx` + `useAuth` hook |
| Logout (clear token, redirect `/`)                      | `user.service.ts`                       | `useAuth` hook                      |
| Token storage (`localStorage.jwtToken`)                 | `jwt.service.ts`                        | `tokenService.ts`                   |
| Token attach to requests (`Authorization: Token <jwt>`) | `token.interceptor.ts`                  | Axios/fetch interceptor             |
| Auth state rehydration on refresh (`GET /user`)         | `user.service.ts.getCurrentUser()`      | `AuthProvider` `useEffect`          |
| Auth guard (redirect unauthenticated users)             | `requireAuth` in `app.routes.ts`        | `<ProtectedRoute>` wrapper          |
| Error display on login/register                         | `list-errors.component.ts`              | `<ListErrors>` component            |

**Auth approach**: Real auth against `https://api.realworld.show/api`. No mocking.

### 2. Feed List (Home Page)

| Feature                            | Angular Source                              | React Target               |
| ---------------------------------- | ------------------------------------------- | -------------------------- |
| Global Feed (`GET /articles`)      | `home.component.ts` + `articles.service.ts` | `HomePage.tsx`             |
| Your Feed (`GET /articles/feed`)   | same                                        | same page, tab toggle      |
| Tag filter (`GET /articles?tag=X`) | `home.component.ts` via route `/tag/:tag`   | `HomePage.tsx` query param |
| Popular tags sidebar (`GET /tags`) | `tags.service.ts`                           | `TagsSidebar.tsx`          |
| Article preview cards              | `article-preview.component.ts`              | `ArticlePreview.tsx`       |
| Pagination                         | `article-list.component.ts`                 | `ArticleList.tsx`          |
| Favorite button on preview         | `favorite-button.component.ts`              | `FavoriteButton.tsx`       |

### 3. Article Detail View

| Feature                                        | Angular Source                     | React Target              |
| ---------------------------------------------- | ---------------------------------- | ------------------------- |
| Article page (`GET /articles/:slug`)           | `article.component.ts`             | `ArticlePage.tsx`         |
| Markdown body rendering                        | `markdown.pipe.ts` (uses `marked`) | `marked` library directly |
| Article meta (author, date, follow/favorite)   | `article-meta.component.ts`        | `ArticleMeta.tsx`         |
| Comments list (`GET /articles/:slug/comments`) | `article.component.ts`             | `ArticlePage.tsx`         |
| Add comment (`POST /articles/:slug/comments`)  | `article.component.ts`             | `ArticlePage.tsx`         |
| Delete comment (own only)                      | `article.component.ts`             | `ArticlePage.tsx`         |
| Delete article (own only)                      | `article.component.ts`             | `ArticlePage.tsx`         |
| Edit article link (own only)                   | `article.component.html`           | `ArticlePage.tsx`         |

### 4. One Migrated Test Suite

| Test                                 | Angular Source                                                | React Target                                     |
| ------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------ |
| `jwt.service.spec.ts` (unit, Vitest) | 35 tests covering token CRUD, lifecycle, edge cases, security | `tokenService.test.ts` (Vitest, same assertions) |

This is the simplest unit test to migrate because `JwtService` is a pure localStorage wrapper with zero Angular dependencies in its logic.

---

## Explicitly Out of Scope (Wave 0)

These features exist in the Angular app but are **not** part of the MVP:

- Editor page (create/edit articles)
- Settings page
- Profile page (`/profile/:username`)
- Follow/unfollow users
- Favorite/unfavorite from feed (detail page only for MVP)
- Error interceptor (global 401 handling)
- Auth retry with exponential backoff
- E2E Playwright tests (unit tests only for Wave 3)
- CSS pixel-perfect match (functional parity only; use same Conduit CSS)

---

## Tech Stack (React App)

| Concern    | Choice                | Rationale                                 |
| ---------- | --------------------- | ----------------------------------------- |
| Framework  | React 18 + TypeScript | Target of migration                       |
| Routing    | React Router v6       | Closest to Angular Router                 |
| State      | React Context + hooks | Minimal; matches Angular service pattern  |
| HTTP       | fetch + thin wrapper  | No extra deps; mirrors Angular HttpClient |
| Markdown   | `marked`              | Same library as Angular app               |
| Styling    | Conduit CSS CDN       | Same stylesheet as Angular app            |
| Build      | Vite                  | Fast, TypeScript-native                   |
| Unit Tests | Vitest                | Same as Angular app                       |
| Dev Port   | `5173` (Vite default) | Avoids conflict with Angular `4200`       |
