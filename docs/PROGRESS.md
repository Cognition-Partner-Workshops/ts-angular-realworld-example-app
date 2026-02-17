# PROGRESS.md - MVP Parity Tracking

Tracks migration progress for each feature listed in [SCOPE.md](./SCOPE.md). All items start unchecked; check them off as each feature is implemented and verified in the React app.

---

## Wave Status

- [x] **Wave 0** - Planning docs (SCOPE, CONTRACTS, DEMO_PLAN, WAVES)
- [ ] **Wave 1** - React scaffold + contracts implementation
- [ ] **Wave 2** - MVP vertical slices (Feed + Article + Auth UI)
- [ ] **Wave 3** - Test suite migration + polish

---

## Auth

- [ ] Login page (`POST /users/login`) — `LoginPage.tsx` + `useAuth` hook
- [ ] Register page (`POST /users`) — `RegisterPage.tsx` + `useAuth` hook
- [ ] Logout (clear token, redirect `/`) — `useAuth` hook
- [ ] Token storage (`localStorage.jwtToken`) — `tokenService.ts`
- [ ] Token attach to requests (`Authorization: Token <jwt>`) — Axios/fetch interceptor
- [ ] Auth state rehydration on refresh (`GET /user`) — `AuthProvider` `useEffect`
- [ ] Auth guard (redirect unauthenticated users) — `<ProtectedRoute>` wrapper
- [ ] Error display on login/register — `<ListErrors>` component

## Feed List (Home Page)

- [ ] Global Feed (`GET /articles`) — `HomePage.tsx`
- [ ] Your Feed (`GET /articles/feed`) — `HomePage.tsx` tab toggle
- [ ] Tag filter (`GET /articles?tag=X`) — `HomePage.tsx` query param
- [ ] Popular tags sidebar (`GET /tags`) — `TagsSidebar.tsx`
- [ ] Article preview cards — `ArticlePreview.tsx`
- [ ] Pagination — `ArticleList.tsx`
- [ ] Favorite button on preview — `FavoriteButton.tsx`

## Article Detail View

- [ ] Article page (`GET /articles/:slug`) — `ArticlePage.tsx`
- [ ] Markdown body rendering — `marked` library
- [ ] Article meta (author, date, follow/favorite) — `ArticleMeta.tsx`
- [ ] Comments list (`GET /articles/:slug/comments`) — `ArticlePage.tsx`
- [ ] Add comment (`POST /articles/:slug/comments`) — `ArticlePage.tsx`
- [ ] Delete comment (own only) — `ArticlePage.tsx`
- [ ] Delete article (own only) — `ArticlePage.tsx`
- [ ] Edit article link (own only) — `ArticlePage.tsx`

## Test Suite

- [ ] `jwt.service.spec.ts` migrated to `tokenService.test.ts` (Vitest, 35+ tests)

---

## Scaffold / Infrastructure

- [ ] Vite + React + TypeScript project (`react-app/`)
- [ ] React Router v6 with all MVP routes (placeholder pages)
- [ ] Shared TypeScript types (`react-app/src/types/index.ts`)
- [ ] API client module (`react-app/src/api/`)
- [ ] Auth context + token service (`react-app/src/auth/`)
- [ ] `data-testid` attributes on all interactive elements
- [ ] Layout shell (Header + Footer with auth-aware nav)

---

## Gate Checks

### Wave 1 Gates

- [ ] `cd react-app && npm run dev` boots on port 5173 without errors
- [ ] `cd react-app && npx tsc --noEmit` exits 0
- [ ] Routes `/`, `/login`, `/register`, `/article/:slug` all resolve

### Wave 2 Gates

- [ ] Auth flow works end-to-end (register, refresh, login)
- [ ] Feed displays articles with tag filtering
- [ ] Article detail renders with markdown and comments
- [ ] TypeScript compiles cleanly

### Wave 3 Gates

- [ ] `cd react-app && npx vitest run` — all tests pass
- [ ] Both apps run simultaneously (ports 4200 + 5173)
- [ ] Demo flows 1-3 succeed on both apps
