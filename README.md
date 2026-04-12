# Team Calendar App

## Overview

This is a calendar app I built for my team at work. It’s designed around the kinds of events we actually deal with day to day, instead of trying to force everything into a generic calendar setup.

Right now it’s focused on our team, but the way it’s structured could be expanded so other teams in the organization could use it too.

---

## What it does

- Create, edit, and delete events
- Handle multi-day and overlapping events
- Assign staff to events
- Filter events by type or staff
- Manage staff (add / remove)
- View everything in a calendar layout that makes sense visually

---

## Tech

- Vue 3
- TypeScript
- SCSS
- date-fns
- Firebase / Firestore

---

## How it’s structured

Most of the logic lives inside the calendar feature:

- **components/** → UI (calendar, modals, forms, etc.)
- **utils/** → logic for things like event handling, dates, layout
- **services/** → Firestore calls (fetching and updating data)

Outside of that:

- **stores/** → app state (events and staff)
- **styles/** → global styles and tokens

One important thing in this app is that figuring out _where events go_ in the calendar is handled separately from how they’re displayed. That keeps the layout logic from getting tangled up with the UI.

---

## Data

Events and staff are stored in Firestore.

There’s a small service layer that handles:

- fetching data
- creating / updating / deleting records

The stores then hold that data for the app to use.

---

## Styling

- Uses SCSS with a shared set of variables
- Styles are meant to stay consistent across the app
- Nothing too flashy — just clean and readable

---

## Running the app

```bash
npm install
npm run dev
```

You’ll need Firebase environment variables set up:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Future ideas

- Auto-generate holidays and birthdays
- Support multiple teams

---

## Notes

This project was built to solve a real problem for my team, so the focus has always been on making it practical and easy to work with rather than over-engineering it.

It’s something I can keep building on as needs change.
