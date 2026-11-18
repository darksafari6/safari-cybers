# CyberSafari

A guest-access cybersecurity learning workspace with reading rooms, lessons, and learning paths. Lessons are educational content, not a live terminal or isolated lab. Progress is saved in the current browser when local storage is available; it does not sync between devices. No account, AI service, or API key is required.

## Local development

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Set `PORT` in the shell to use a different port.

## Production

```sh
npm ci
npm run lint
npm run build
npm start
```

Run from the repository root with the installed dependencies (including `tsx`) and the built `dist/` directory. Express serves the app and `GET /api/status` on the same port. For a quick health check, run `curl -f http://localhost:3000/api/status`.

## Browser tests

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

On Linux, use `npx playwright install --with-deps chromium` if browser libraries are missing. Tests cover keyboard entry, lesson completion and resume, mobile deep links, and browser history. Rooms and learning paths can be shared using the URL in the address bar.

## Academy content

Defensive Engineering includes four courses and a two-session incident capstone. Edit course metadata and practice prompts in `src/courses.ts`; chapter text lives in `src/books/<room-id>-<task-id>.md`. Keep room and task IDs stable so existing links and saved progress remain valid. Reader preferences, bookmarks, and reading completion are saved separately from practice progress in the current browser.
