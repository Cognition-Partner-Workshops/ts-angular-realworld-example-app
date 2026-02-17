# WAVES.md - Migration Wave Plan

## Overview

The migration is structured in 3 waves. Each wave has defined inputs, outputs, gates (validation commands), and worker task briefs. Waves are sequential; tasks within a wave may be parallelized where noted.

---

## Wave 1: React Scaffold + Contracts Implementation

**Goal**: Bootable React app with routing shell, shared types, API client, and auth context. No UI beyond placeholder pages.

**Depends on**: `docs/SCOPE.md`, `docs/CONTRACTS.md` (Wave 0 outputs)

### Tasks

| ID   | Task                                                 | Parallelizable                             | Worker   |
| ---- | ---------------------------------------------------- | ------------------------------------------ | -------- |
| W1.1 | Vite + React + TypeScript scaffold                   | No (must be first)                         | Worker A |
| W1.2 | Shared TypeScript types (`react-app/src/types/`)     | Yes (after W1.1)                           | Worker A |
| W1.3 | API client module (`react-app/src/api/`)             | Yes (after W1.1)                           | Worker A |
| W1.4 | Auth context + token service (`react-app/src/auth/`) | Yes (after W1.1)                           | Worker A |
| W1.5 | Router setup with placeholder pages                  | After W1.4 (needs auth context for guards) | Worker A |

### Gates

```bash
# Gate W1-G1: App boots without errors
cd react-app && npm run dev
# Expect: Vite serves on http://localhost:5173 with no console errors

# Gate W1-G2: TypeScript compiles cleanly
cd react-app && npx tsc --noEmit
# Expect: Exit code 0, no type errors

# Gate W1-G3: All routes resolve (manual or smoke test)
# Visit: /, /login, /register, /article/test-slug
# Expect: Each renders a placeholder component (no 404, no crash)
```

### Worker Task Brief: W1 - React Scaffold + Contracts

```
TASK BRIEF: Wave 1 - React Scaffold + Contracts Implementation
==============================================================

GOAL:
Create a bootable React 18 + TypeScript app under react-app/ with:
- Vite build tooling
- React Router v6 with all MVP routes (placeholder components)
- Shared TypeScript types matching CONTRACTS.md exactly
- API client module with all function signatures from CONTRACTS.md
- Auth context (React Context + useAuth hook) with token persistence
- ProtectedRoute wrapper for auth-gated routes

ALLOWED FOLDERS/FILES TO TOUCH:
- react-app/ (create entire directory)
- DO NOT modify any files outside react-app/

INPUTS (docs to read):
- docs/SCOPE.md (tech stack decisions, feature list)
- docs/CONTRACTS.md (types, API signatures, routes, data-testid convention)

OUTPUTS (files to produce):
- react-app/package.json
- react-app/tsconfig.json
- react-app/vite.config.ts
- react-app/index.html (with Conduit CSS CDN link)
- react-app/src/main.tsx
- react-app/src/App.tsx (router setup)
- react-app/src/types/index.ts (User, Profile, Article, Comment, ErrorResponse, ArticleListConfig)
- react-app/src/api/client.ts (base fetch wrapper with token injection)
- react-app/src/api/auth.ts (login, register, getCurrentUser)
- react-app/src/api/articles.ts (listArticles, getArticle, deleteArticle, favoriteArticle, unfavoriteArticle)
- react-app/src/api/comments.ts (getComments, addComment, deleteComment)
- react-app/src/api/tags.ts (getTags)
- react-app/src/api/profiles.ts (getProfile, followUser, unfollowUser)
- react-app/src/auth/tokenService.ts (getToken, saveToken, destroyToken)
- react-app/src/auth/AuthContext.tsx (AuthProvider, useAuth hook)
- react-app/src/components/ProtectedRoute.tsx
- react-app/src/pages/HomePage.tsx (placeholder)
- react-app/src/pages/LoginPage.tsx (placeholder)
- react-app/src/pages/RegisterPage.tsx (placeholder)
- react-app/src/pages/ArticlePage.tsx (placeholder)

ACCEPTANCE CRITERIA:
1. `cd react-app && npm install && npm run dev` boots without errors on port 5173
2. `cd react-app && npx tsc --noEmit` exits 0
3. Visiting http://localhost:5173/ shows placeholder home page
4. Visiting http://localhost:5173/login shows placeholder login page
5. Visiting http://localhost:5173/article/test shows placeholder article page
6. All types in src/types/index.ts match CONTRACTS.md exactly
7. API client functions have correct signatures (compile-time check via tsc)
8. AuthContext provides: user, isAuthenticated, login, register, logout
9. Token service uses localStorage key "jwtToken"
10. ProtectedRoute redirects to /login when not authenticated
```

---

## Wave 2: MVP Vertical Slices (Feed + Article + Auth)

**Goal**: Functional UI for the three demo flows: auth, feed browsing, and article detail.

**Depends on**: Wave 1 gates passed

### Tasks

| ID   | Task                                                    | Parallelizable                     | Worker   |
| ---- | ------------------------------------------------------- | ---------------------------------- | -------- |
| W2.1 | Auth pages (Login + Register with forms, error display) | Yes                                | Worker B |
| W2.2 | Home page (feed list, tabs, tag sidebar, pagination)    | Yes                                | Worker C |
| W2.3 | Article detail page (body, meta, comments, actions)     | Yes                                | Worker D |
| W2.4 | Layout shell (Header with auth-aware nav, Footer)       | No (do first, others depend on it) | Worker B |

**Parallelization note**: W2.4 (Layout) should be done first. Then W2.1, W2.2, W2.3 can proceed in parallel since they are independent page components that slot into the layout.

### Gates

```bash
# Gate W2-G1: Auth flow works end-to-end
# 1. Visit /register, fill form, submit -> redirects to /
# 2. Refresh page -> still logged in (navbar shows username)
# 3. Visit /login after logout -> can log back in

# Gate W2-G2: Feed displays articles
# 1. Visit / -> Global Feed tab active, article cards render
# 2. Click a tag in sidebar -> tag tab appears, articles filter
# 3. Click Global Feed -> returns to unfiltered view

# Gate W2-G3: Article detail works
# 1. Click article title from feed -> /article/:slug loads
# 2. Article body renders as HTML (markdown processed)
# 3. Comments section visible
# 4. (Logged in) Can post a comment
# 5. (Own article) Edit/Delete buttons visible

# Gate W2-G4: TypeScript still clean
cd react-app && npx tsc --noEmit
# Expect: Exit code 0
```

### Worker Task Brief: W2.1 - Auth Pages

```
TASK BRIEF: Wave 2.1 - Auth Pages (Login + Register)
=====================================================

GOAL:
Implement functional Login and Register pages with form validation,
error display, and redirect on success. Wire to real API.

ALLOWED FOLDERS/FILES TO TOUCH:
- react-app/src/pages/LoginPage.tsx
- react-app/src/pages/RegisterPage.tsx
- react-app/src/components/ListErrors.tsx (create)

INPUTS:
- docs/CONTRACTS.md (data-testid values, ErrorResponse type)
- src/app/core/auth/auth.component.ts (Angular reference)
- src/app/core/auth/auth.component.html (Angular template reference)
- react-app/src/auth/AuthContext.tsx (useAuth hook)
- react-app/src/api/auth.ts (login, register functions)

OUTPUTS:
- react-app/src/pages/LoginPage.tsx (functional login form)
- react-app/src/pages/RegisterPage.tsx (functional register form)
- react-app/src/components/ListErrors.tsx (error display component)

ACCEPTANCE CRITERIA:
1. Login form has email + password fields with data-testid attrs
2. Register form has username + email + password fields with data-testid attrs
3. Submitting valid credentials redirects to /
4. Submitting invalid credentials shows error messages in ListErrors
5. Submit button shows loading state (disabled) during request
6. /login redirects to / if already authenticated
7. /register redirects to / if already authenticated
8. CSS classes match Angular app (.error-messages, .btn, etc.)
```

### Worker Task Brief: W2.2 - Home Page (Feed + Tags)

```
TASK BRIEF: Wave 2.2 - Home Page (Feed + Tags + Pagination)
============================================================

GOAL:
Implement the home page with Global Feed, Your Feed, tag filtering,
popular tags sidebar, article preview cards, and pagination.

ALLOWED FOLDERS/FILES TO TOUCH:
- react-app/src/pages/HomePage.tsx
- react-app/src/components/ArticleList.tsx (create)
- react-app/src/components/ArticlePreview.tsx (create)
- react-app/src/components/TagsSidebar.tsx (create)
- react-app/src/components/Pagination.tsx (create)
- react-app/src/components/FavoriteButton.tsx (create)

INPUTS:
- docs/CONTRACTS.md (data-testid values, Article type, API signatures)
- src/app/features/article/pages/home/ (Angular reference)
- src/app/features/article/components/ (Angular component reference)
- react-app/src/api/articles.ts (listArticles)
- react-app/src/api/tags.ts (getTags)
- react-app/src/auth/AuthContext.tsx (useAuth for Your Feed)

OUTPUTS:
- react-app/src/pages/HomePage.tsx
- react-app/src/components/ArticleList.tsx
- react-app/src/components/ArticlePreview.tsx
- react-app/src/components/TagsSidebar.tsx
- react-app/src/components/Pagination.tsx
- react-app/src/components/FavoriteButton.tsx

ACCEPTANCE CRITERIA:
1. Global Feed tab loads and displays article cards from GET /articles
2. Your Feed tab appears when logged in, loads from GET /articles/feed
3. Clicking a tag in sidebar adds a tag tab and filters articles
4. Article preview shows: title, description, author (avatar + name), date, favorite count, tags
5. Pagination renders when articlesCount > 10, clicking changes page
6. Favorite button toggles on click (POST/DELETE /articles/:slug/favorite)
7. All elements have data-testid attributes per CONTRACTS.md
8. CSS classes match Angular app structure
```

### Worker Task Brief: W2.3 - Article Detail Page

```
TASK BRIEF: Wave 2.3 - Article Detail Page
===========================================

GOAL:
Implement the article detail page with markdown rendering, author meta,
comments list, add/delete comments, and article actions (edit/delete/favorite/follow).

ALLOWED FOLDERS/FILES TO TOUCH:
- react-app/src/pages/ArticlePage.tsx
- react-app/src/components/ArticleMeta.tsx (create)
- react-app/src/components/ArticleComment.tsx (create)
- react-app/src/components/FollowButton.tsx (create)

INPUTS:
- docs/CONTRACTS.md (data-testid values, types, API signatures)
- src/app/features/article/pages/article/ (Angular reference)
- src/app/features/article/components/ (Angular component reference)
- react-app/src/api/articles.ts
- react-app/src/api/comments.ts
- react-app/src/api/profiles.ts
- react-app/src/auth/AuthContext.tsx

OUTPUTS:
- react-app/src/pages/ArticlePage.tsx
- react-app/src/components/ArticleMeta.tsx
- react-app/src/components/ArticleComment.tsx
- react-app/src/components/FollowButton.tsx

ACCEPTANCE CRITERIA:
1. GET /articles/:slug loads and displays article title, body, tags
2. Article body is rendered as HTML via `marked` library
3. Author meta shows avatar, username (link), date, follow button, favorite button
4. Comments load from GET /articles/:slug/comments
5. Logged-in user can post a comment (textarea + submit button)
6. User can delete own comments (trash icon)
7. Article author sees Edit Article link and Delete Article button
8. Delete Article removes article and redirects to /
9. Follow/Favorite buttons call correct API endpoints and update UI
10. All elements have data-testid attributes per CONTRACTS.md
```

### Worker Task Brief: W2.4 - Layout Shell

```
TASK BRIEF: Wave 2.4 - Layout Shell (Header + Footer)
======================================================

GOAL:
Implement the shared layout with auth-aware header navigation and footer.

ALLOWED FOLDERS/FILES TO TOUCH:
- react-app/src/components/Header.tsx (create)
- react-app/src/components/Footer.tsx (create)
- react-app/src/App.tsx (wrap routes in layout)

INPUTS:
- docs/CONTRACTS.md (data-testid values for header elements)
- src/app/core/layout/ (Angular header/footer reference)
- react-app/src/auth/AuthContext.tsx (useAuth for conditional nav)

OUTPUTS:
- react-app/src/components/Header.tsx
- react-app/src/components/Footer.tsx
- react-app/src/App.tsx (updated with layout wrapper)

ACCEPTANCE CRITERIA:
1. Header shows logo ("conduit") linking to /
2. Unauthenticated: shows Home, Sign in, Sign up links
3. Authenticated: shows Home, New Article (/editor), Settings (/settings), Profile (/profile/:username) links
4. Footer shows attribution text
5. All nav links have correct data-testid attributes
6. CSS classes match Angular app (.navbar, .navbar-brand, .nav-link, etc.)
```

---

## Wave 3: Test Suite Migration + Polish

**Goal**: Migrate the `jwt.service.spec.ts` unit test suite to React's `tokenService.test.ts`. Polish any rough edges.

**Depends on**: Wave 2 gates passed

### Tasks

| ID   | Task                                                             | Parallelizable          | Worker   |
| ---- | ---------------------------------------------------------------- | ----------------------- | -------- |
| W3.1 | Migrate jwt.service.spec.ts -> tokenService.test.ts              | No                      | Worker E |
| W3.2 | Visual polish pass (CSS alignment, loading states, error states) | Yes (after W3.1 starts) | Worker F |
| W3.3 | Demo dry-run and DEMO_PLAN.md update                             | After W3.1 + W3.2       | Worker F |

### Gates

```bash
# Gate W3-G1: Migrated test suite passes
cd react-app && npx vitest run
# Expect: All tests pass (tokenService.test.ts)

# Gate W3-G2: Full TypeScript check
cd react-app && npx tsc --noEmit
# Expect: Exit code 0

# Gate W3-G3: Both apps run simultaneously
# Terminal 1: cd ts-angular-realworld-example-app && npm run start (port 4200)
# Terminal 2: cd ts-angular-realworld-example-app/react-app && npm run dev (port 5173)
# Expect: Both serve without errors

# Gate W3-G4: Demo flows work
# Execute DEMO_PLAN.md flows 1-3 on both apps
# Expect: All steps succeed on both apps
```

### Worker Task Brief: W3.1 - Test Suite Migration

```
TASK BRIEF: Wave 3.1 - Migrate jwt.service.spec.ts to tokenService.test.ts
===========================================================================

GOAL:
Port all 35 tests from Angular's jwt.service.spec.ts to a Vitest test
file for React's tokenService. Same test structure, same assertions,
adapted for the plain-TypeScript module (no Angular TestBed).

ALLOWED FOLDERS/FILES TO TOUCH:
- react-app/src/auth/tokenService.test.ts (create)
- react-app/vitest.config.ts (create if needed)
- react-app/package.json (add vitest devDependency if not present)

INPUTS:
- src/app/core/auth/services/jwt.service.spec.ts (Angular test source - 335 lines)
- react-app/src/auth/tokenService.ts (React implementation to test)
- docs/CONTRACTS.md (token storage contract)

OUTPUTS:
- react-app/src/auth/tokenService.test.ts
- react-app/vitest.config.ts (if needed)

ACCEPTANCE CRITERIA:
1. Test file has same describe/it structure as Angular source
2. All test categories preserved: getToken, saveToken, destroyToken, Token lifecycle, Edge cases, Security considerations, Integration scenarios
3. Tests use vitest (describe, it, expect, vi.fn, beforeEach, afterEach)
4. No Angular-specific code (no TestBed, no zone.js)
5. All tests pass: `cd react-app && npx vitest run`
6. Tests mock localStorage the same way as Angular tests
7. Test count matches or exceeds Angular source (35+ tests)
```

### Worker Task Brief: W3.2 - Visual Polish

```
TASK BRIEF: Wave 3.2 - Visual Polish Pass
==========================================

GOAL:
Ensure the React app looks and feels equivalent to the Angular app.
Fix CSS issues, add loading states, handle error states gracefully.

ALLOWED FOLDERS/FILES TO TOUCH:
- react-app/src/**/*.tsx (any component)
- react-app/src/**/*.css (if needed)

INPUTS:
- Angular app running on localhost:4200 (visual reference)
- docs/CONTRACTS.md (CSS class requirements)

OUTPUTS:
- Updated components with correct CSS classes
- Loading indicators where Angular has them
- Error boundaries or fallback UI for failed API calls

ACCEPTANCE CRITERIA:
1. Side-by-side comparison: both apps look structurally similar
2. Loading states visible while API calls in progress
3. Error messages display correctly for failed requests
4. No console errors in browser DevTools
5. Default user avatar image works (uses same fallback as Angular)
6. Dates format consistently between both apps
```

---

## Summary Timeline

```
Wave 0 (this doc)     -----> docs/SCOPE.md, CONTRACTS.md, DEMO_PLAN.md, WAVES.md
Wave 1 (scaffold)     -----> Bootable React app, types, API client, auth context
Wave 2 (UI slices)    -----> Auth pages | Feed page | Article page | Layout
Wave 3 (tests+polish) -----> tokenService.test.ts, CSS polish, demo dry-run
```

Each wave blocks on its predecessor's gates. Within Wave 2, tasks W2.1-W2.3 can run in parallel after W2.4 (layout) is complete.
