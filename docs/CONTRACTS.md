# CONTRACTS.md - Stable Seams Between Angular and React Apps

This document defines the shared contracts that both the Angular "before" and React "after" apps must respect. These are the minimal stable seams that keep the two apps functionally equivalent.

---

## 1. Route Names + Params (MVP Pages)

| Route              | Params        | Description               | Auth Required           |
| ------------------ | ------------- | ------------------------- | ----------------------- |
| `/`                | none          | Home page - Global Feed   | No                      |
| `/?feed=following` | query: `feed` | Home page - Your Feed     | Yes                     |
| `/tag/:tag`        | param: `tag`  | Home page filtered by tag | No                      |
| `/login`           | none          | Sign in page              | No (redirect if authed) |
| `/register`        | none          | Sign up page              | No (redirect if authed) |
| `/article/:slug`   | param: `slug` | Article detail page       | No                      |

### Route Behavior Notes

- `/login` and `/register` redirect to `/` if user is already authenticated
- `/?feed=following` redirects to `/login` if user is not authenticated
- Angular uses `/tag/:tag` as a separate route; React may implement as `/` with a query param or keep the same pattern (must be functionally equivalent)

---

## 2. TypeScript Types

All types must be defined in `react-app/src/types/` and must match the Angular models exactly.

### User

```typescript
// Source: src/app/core/auth/user.model.ts
interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}
```

### Profile

```typescript
// Source: src/app/features/profile/models/profile.model.ts
interface Profile {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}
```

### Article

```typescript
// Source: src/app/features/article/models/article.model.ts
interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}
```

### Comment

```typescript
// Source: src/app/features/article/models/comment.model.ts
interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: Profile;
}
```

### ErrorResponse

```typescript
// Source: src/app/core/models/errors.model.ts
interface ErrorResponse {
  errors: { [key: string]: string };
}
```

### ArticleListConfig

```typescript
// Source: src/app/features/article/models/article-list-config.model.ts
interface ArticleListConfig {
  type: string; // 'all' | 'feed'
  filters: {
    tag?: string;
    author?: string;
    favorited?: string;
    limit?: number;
    offset?: number;
  };
}
```

---

## 3. API Client Function Signatures

Base URL: `https://api.realworld.show/api`

All requests include `Authorization: Token <jwt>` header when a token exists in `localStorage.jwtToken`.

### Auth

```typescript
// POST /users/login
function login(credentials: { email: string; password: string }): Promise<{ user: User }>;

// POST /users
function register(credentials: { username: string; email: string; password: string }): Promise<{ user: User }>;

// GET /user (current authenticated user)
function getCurrentUser(): Promise<{ user: User }>;
```

### Articles

```typescript
// GET /articles or GET /articles/feed (based on config.type)
function listArticles(config: ArticleListConfig): Promise<{ articles: Article[]; articlesCount: number }>;

// GET /articles/:slug
function getArticle(slug: string): Promise<{ article: Article }>;

// DELETE /articles/:slug
function deleteArticle(slug: string): Promise<void>;

// POST /articles/:slug/favorite
function favoriteArticle(slug: string): Promise<{ article: Article }>;

// DELETE /articles/:slug/favorite
function unfavoriteArticle(slug: string): Promise<void>;
```

### Comments

```typescript
// GET /articles/:slug/comments
function getComments(slug: string): Promise<{ comments: Comment[] }>;

// POST /articles/:slug/comments
function addComment(slug: string, body: string): Promise<{ comment: Comment }>;

// DELETE /articles/:slug/comments/:id
function deleteComment(slug: string, commentId: string): Promise<void>;
```

### Tags

```typescript
// GET /tags
function getTags(): Promise<{ tags: string[] }>;
```

### Profiles

```typescript
// GET /profiles/:username
function getProfile(username: string): Promise<{ profile: Profile }>;

// POST /profiles/:username/follow
function followUser(username: string): Promise<{ profile: Profile }>;

// DELETE /profiles/:username/follow
function unfollowUser(username: string): Promise<{ profile: Profile }>;
```

---

## 4. Token Storage Contract

| Key        | Storage               | Format             |
| ---------- | --------------------- | ------------------ |
| `jwtToken` | `window.localStorage` | Plain string (JWT) |

### Operations

```typescript
function getToken(): string | undefined; // localStorage['jwtToken']
function saveToken(token: string): void; // localStorage['jwtToken'] = token
function destroyToken(): void; // localStorage.removeItem('jwtToken')
```

Both apps MUST use the same localStorage key (`jwtToken`) so that auth state is shared if running on the same origin (different ports means separate storage, which is fine for the demo).

---

## 5. `data-testid` Convention

All interactive and structural elements in the React app must include `data-testid` attributes following this convention:

### Naming Pattern

```
data-testid="{component}-{element}"
```

- Use kebab-case
- Component name first, then element descriptor
- Keep it stable (don't tie to implementation details)

### Required Test IDs (MVP)

| Test ID                       | Element                        | Page                      |
| ----------------------------- | ------------------------------ | ------------------------- |
| `header-logo`                 | Navbar brand link              | Layout                    |
| `header-sign-in`              | Sign in nav link               | Layout                    |
| `header-sign-up`              | Sign up nav link               | Layout                    |
| `header-new-article`          | New Article nav link           | Layout (authed)           |
| `header-settings`             | Settings nav link              | Layout (authed)           |
| `header-profile`              | Profile nav link               | Layout (authed)           |
| `auth-email`                  | Email input                    | Login/Register            |
| `auth-password`               | Password input                 | Login/Register            |
| `auth-username`               | Username input                 | Register                  |
| `auth-submit`                 | Submit button                  | Login/Register            |
| `auth-errors`                 | Error messages container       | Login/Register            |
| `feed-toggle-global`          | Global Feed tab                | Home                      |
| `feed-toggle-your`            | Your Feed tab                  | Home                      |
| `feed-toggle-tag`             | Tag filter tab                 | Home                      |
| `article-preview`             | Article preview card           | Home (repeated)           |
| `article-preview-title`       | Article title in preview       | Home (repeated)           |
| `article-preview-description` | Article description in preview | Home (repeated)           |
| `article-preview-author`      | Author link in preview         | Home (repeated)           |
| `article-preview-date`        | Date in preview                | Home (repeated)           |
| `article-preview-favorite`    | Favorite button in preview     | Home (repeated)           |
| `tags-sidebar`                | Popular tags sidebar           | Home                      |
| `tag-pill`                    | Individual tag pill            | Home (repeated)           |
| `pagination`                  | Pagination container           | Home                      |
| `article-title`               | Article title                  | Article Detail            |
| `article-body`                | Article body (markdown)        | Article Detail            |
| `article-tags`                | Tag list on article            | Article Detail            |
| `article-meta`                | Article meta section           | Article Detail            |
| `article-delete`              | Delete article button          | Article Detail            |
| `article-edit`                | Edit article link              | Article Detail            |
| `article-favorite`            | Favorite/unfavorite button     | Article Detail            |
| `article-follow`              | Follow/unfollow button         | Article Detail            |
| `comment-form`                | Comment textarea               | Article Detail            |
| `comment-submit`              | Post comment button            | Article Detail            |
| `comment-card`                | Individual comment             | Article Detail (repeated) |
| `comment-delete`              | Delete comment button          | Article Detail (repeated) |

---

## 6. CSS Class Compatibility

Both apps use the same Conduit CSS from the RealWorld spec. The React app must use the same CSS class names for structural elements to ensure visual parity:

- `.navbar`, `.navbar-brand`, `.nav-link`
- `.article-preview`, `.article-meta`, `.tag-list`, `.tag-default`, `.tag-pill`
- `.banner`, `.container`, `.sidebar`
- `.error-messages`
- `.article-content`
- `.comment-form`, `.card`
- `.btn`, `.btn-primary`, `.btn-outline-primary`, `.btn-danger`
- `.user-info`

The React app should load the Conduit CSS via CDN in `index.html`:

```html
<link href="//demo.productionready.io/main.css" rel="stylesheet" type="text/css" />
```
