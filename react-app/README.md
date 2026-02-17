# React App (Conduit - RealWorld Example)

React 18 + TypeScript migration of the Angular RealWorld example app. Runs side-by-side with the Angular app on a separate port for feature parity comparison.

## Quick Start

```bash
cd react-app
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

## Running Both Apps Side-by-Side

Open two terminal windows:

**Terminal 1 — Angular (port 4200):**

```bash
# From the repo root
npm install
npm run start
# App available at http://localhost:4200
```

**Terminal 2 — React (port 5173):**

```bash
# From the repo root
cd react-app
npm install
npm run dev
# App available at http://localhost:5173
```

Open both in browser tabs for side-by-side comparison.

## TypeScript Checks

```bash
cd react-app
npx tsc --noEmit
```

This should exit with code 0 and no type errors.

## Running Tests

```bash
cd react-app
npx vitest run
```

## `data-testid` Convention

All interactive and structural elements use `data-testid` attributes for stable test selectors.

### Naming Pattern

```
data-testid="{component}-{element}"
```

- Use **kebab-case**
- Component name first, then element descriptor
- Keep it stable — don't tie to implementation details

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

See [docs/CONTRACTS.md](../docs/CONTRACTS.md) for full contract details.

## Tech Stack

| Concern    | Choice                |
| ---------- | --------------------- |
| Framework  | React 18 + TypeScript |
| Routing    | React Router v6       |
| State      | React Context + hooks |
| HTTP       | fetch + thin wrapper  |
| Markdown   | `marked`              |
| Styling    | Conduit CSS CDN       |
| Build      | Vite                  |
| Unit Tests | Vitest                |
| Dev Port   | 5173 (Vite default)   |

## Troubleshooting

| Issue               | Fix                                                    |
| ------------------- | ------------------------------------------------------ |
| Port 5173 in use    | Vite auto-increments to 5174                           |
| Port 4200 in use    | `npx kill-port 4200` or use `ng serve --port 4201`     |
| API errors          | Check `https://api.realworld.show/api/tags` in browser |
| `npm install` fails | Ensure Node >= 20.11.1: `node -v`                      |
