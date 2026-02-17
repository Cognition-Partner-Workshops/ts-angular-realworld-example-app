# PROGRESS.md - MVP Parity Tracking

Tracks migration progress for each feature listed in [SCOPE.md](./SCOPE.md). All items start unchecked; check them off as each feature is implemented and verified in the React app.

---

## Wave Status

- [x] **Wave 0** - Planning docs (SCOPE, CONTRACTS, DEMO_PLAN, WAVES)
- [x] **Wave 1** - React scaffold + contracts implementation
- [x] **Wave 2** - MVP vertical slices (Feed + Article + Auth UI)
- [ ] **Wave 3** - Test suite migration + polish

---

## Auth

- [x] Login page (`POST /users/login`) — `LoginPage.tsx` + `useAuth` hook
- [x] Register page (`POST /users`) — `RegisterPage.tsx` + `useAuth` hook
- [x] Logout (clear token, redirect `/`) — `useAuth` hook
- [x] Token storage (`localStorage.jwtToken`) — `tokenService.ts`
- [x] Token attach to requests (`Authorization: Token <jwt>`) — Axios/fetch interceptor
- [x] Auth state rehydration on refresh (`GET /user`) — `AuthProvider` `useEffect`
- [x] Auth guard (redirect unauthenticated users) — `<ProtectedRoute>` wrapper
- [x] Error display on login/register — `<ListErrors>` component

## Feed List (Home Page)

- [x] Global Feed (`GET /articles`) — `HomePage.tsx`
- [x] Your Feed (`GET /articles/feed`) — `HomePage.tsx` tab toggle
- [x] Tag filter (`GET /articles?tag=X`) — `HomePage.tsx` query param
- [x] Popular tags sidebar (`GET /tags`) — `TagsSidebar.tsx`
- [x] Article preview cards — `ArticlePreview.tsx`
- [x] Pagination — `ArticleList.tsx`
- [x] Favorite button on preview — `FavoriteButton.tsx`

## Article Detail View

- [x] Article page (`GET /articles/:slug`) — `ArticlePage.tsx`
- [x] Markdown body rendering — `marked` library
- [x] Article meta (author, date, follow/favorite) — `ArticleMeta.tsx`
- [x] Comments list (`GET /articles/:slug/comments`) — `ArticlePage.tsx`
- [x] Add comment (`POST /articles/:slug/comments`) — `ArticlePage.tsx`
- [x] Delete comment (own only) — `ArticlePage.tsx`
- [x] Delete article (own only) — `ArticlePage.tsx`
- [x] Edit article link (own only) — `ArticlePage.tsx`

## Test Suite

- [ ] `jwt.service.spec.ts` migrated to `tokenService.test.ts` (Vitest, 35+ tests)

---

## Scaffold / Infrastructure

- [x] Vite + React + TypeScript project (`react-app/`)
- [x] React Router v6 with all MVP routes (placeholder pages)
- [x] Shared TypeScript types (`react-app/src/types/index.ts`)
- [x] API client module (`react-app/src/api/`)
- [x] Auth context + token service (`react-app/src/auth/`)
- [x] `data-testid` attributes on all interactive elements
- [x] Layout shell (Header + Footer with auth-aware nav)

---

## Gate Checks

### Wave 1 Gates

- [x] `cd react-app && npm run dev` boots on port 5173 without errors
- [x] `cd react-app && npx tsc --noEmit` exits 0
- [x] Routes `/`, `/login`, `/register`, `/article/:slug` all resolve

### Wave 2 Gates

- [x] Auth flow works end-to-end (register, refresh, login)
- [x] Feed displays articles with tag filtering
- [x] Article detail renders with markdown and comments
- [x] TypeScript compiles cleanly

### Wave 3 Gates

- [ ] `cd react-app && npx vitest run` — all tests pass
- [ ] Both apps run simultaneously (ports 4200 + 5173)
- [ ] Demo flows 1-3 succeed on both apps
