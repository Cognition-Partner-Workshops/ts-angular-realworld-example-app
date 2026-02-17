# DEMO_PLAN.md - Side-by-Side Angular + React Demo

## Migration Status

| Wave   | Description                                        | Status      |
| ------ | -------------------------------------------------- | ----------- |
| Wave 0 | Planning docs (SCOPE, CONTRACTS, DEMO_PLAN, WAVES) | Complete    |
| Wave 1 | React scaffold + contracts implementation          | In Progress |
| Wave 2 | MVP vertical slices (Feed + Article + Auth UI)     | Not Started |
| Wave 3 | Test suite migration + polish                      | In Progress |

> **Note**: This demo plan describes the final state after all waves are complete. During earlier waves, some flows will only show placeholder pages in the React app. See [PROGRESS.md](./PROGRESS.md) for current feature status.

---

## Prerequisites

- Node.js >= 20.11.1
- Two terminal windows

---

## Terminal 1: Angular App (Port 4200)

```bash
cd ts-angular-realworld-example-app
npm install
npm run start
# App available at http://localhost:4200
```

## Terminal 2: React App (Port 5173)

```bash
cd ts-angular-realworld-example-app/react-app
npm install
npm run dev
# App available at http://localhost:5173
```

---

## Demo Script (Click-by-Click)

Open both apps in browser tabs side by side:

- Tab 1: `http://localhost:4200` (Angular)
- Tab 2: `http://localhost:5173` (React)

### Flow 1: Registration + Login (Auth)

**Goal**: Show that auth works identically in both apps, including token persistence.

| Step | Action                                      | Expected (both apps)                                                 |
| ---- | ------------------------------------------- | -------------------------------------------------------------------- |
| 1    | Click **Sign up** in navbar                 | Navigate to `/register`                                              |
| 2    | Fill in Username, Email, Password           | Form fields accept input                                             |
| 3    | Click **Sign up** button                    | Redirect to `/` (home). Navbar shows username, Settings, New Article |
| 4    | Refresh the page (F5)                       | Still logged in (token persisted in localStorage)                    |
| 5    | Click **Settings** in navbar                | Navigate to `/settings` (Angular) / shows auth is intact (React)     |
| 6    | Click **Home** (logo)                       | Return to `/`                                                        |
| 7    | Open DevTools > Application > Local Storage | `jwtToken` key is present with JWT value                             |

> **Note**: Use different email addresses for Angular vs React since they share the same backend. E.g., `demo-angular-123@test.com` and `demo-react-123@test.com`.

### Flow 2: Browse Feed + Filter by Tag

**Goal**: Show that the feed list, tag sidebar, and filtering work identically.

| Step | Action                                        | Expected (both apps)                                                                     |
| ---- | --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1    | On home page `/`, observe **Global Feed** tab | Active tab, list of article preview cards                                                |
| 2    | Scroll down to see articles                   | Article cards show: title, description, author avatar + name, date, favorite count, tags |
| 3    | Look at **Popular Tags** sidebar (right side) | List of tag pills                                                                        |
| 4    | Click any tag pill (e.g., "welcome")          | New tab appears in feed toggle showing the tag name. Articles filtered to that tag       |
| 5    | Click **Global Feed** tab again               | Returns to unfiltered global feed                                                        |
| 6    | (If logged in) Click **Your Feed** tab        | Shows articles from followed authors (may be empty)                                      |

### Flow 3: Article Detail + Comments

**Goal**: Show that article detail view, markdown rendering, and comments work identically.

| Step | Action                                           | Expected (both apps)                                                                                      |
| ---- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| 1    | On home page, click any article title            | Navigate to `/article/:slug`                                                                              |
| 2    | Observe article page                             | Title (h1), author meta (avatar, name, date), Follow + Favorite buttons, article body (markdown rendered) |
| 3    | Scroll down to comments section                  | Existing comments shown (if any), each with author avatar, name, date, body                               |
| 4    | (If logged in) Type a comment in the textarea    | Text appears in form                                                                                      |
| 5    | Click **Post Comment**                           | Comment appears at top of comments list, textarea clears                                                  |
| 6    | (If own comment) Click trash icon on the comment | Comment removed from list                                                                                 |
| 7    | Click author name in article meta                | Navigates to profile page (Angular) / author link works (React)                                           |
| 8    | Click browser **Back** button                    | Returns to article page                                                                                   |

---

## Quick Verification Checklist

After running both apps, verify these critical behaviors:

| Check                    | Command / Action            | Pass Criteria                                |
| ------------------------ | --------------------------- | -------------------------------------------- |
| Angular starts           | `npm run start` in root     | No errors, serves on :4200                   |
| React starts             | `npm run dev` in react-app/ | No errors, serves on :5173                   |
| Angular unit tests       | `npm test` in root          | All tests pass                               |
| React unit tests         | `npm test` in react-app/    | All tests pass (including migrated jwt test) |
| Auth persists (Angular)  | Register, refresh page      | Still logged in                              |
| Auth persists (React)    | Register, refresh page      | Still logged in                              |
| Feed loads (Angular)     | Visit `/`                   | Article cards render                         |
| Feed loads (React)       | Visit `/`                   | Article cards render                         |
| Article detail (Angular) | Click article title         | Full article page renders                    |
| Article detail (React)   | Click article title         | Full article page renders                    |

---

## Running Tests

### Angular Unit Tests

```bash
cd ts-angular-realworld-example-app
npm test
# Expected: All tests pass
```

### React Unit Tests (Vitest)

```bash
cd ts-angular-realworld-example-app/react-app
npm test
# Runs: vitest run
# Expected: 36 passed (tokenService.test.ts)
```

---

## Troubleshooting

| Issue               | Fix                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| Port 4200 in use    | `npx kill-port 4200` or use `ng serve --port 4201`                                                |
| Port 5173 in use    | Vite auto-increments to 5174                                                                      |
| API errors          | Check `https://api.realworld.show/api/tags` in browser - if down, both apps will fail identically |
| CORS errors         | Both apps use the same public API which allows all origins                                        |
| `npm install` fails | Ensure Node >= 20.11.1: `node -v`                                                                 |
