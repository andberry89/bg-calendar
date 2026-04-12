# 📅 Team Calendar App

<p align="left">
  <img src="https://img.shields.io/badge/Vue-3-42b883?style=flat&logo=vue.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/SCSS-Styling-cc6699?style=flat&logo=sass&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-ffca28?style=flat&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/date--fns-Dates-770C56?style=flat" />
</p>

---

## 🧭 Overview

This is a calendar app I built for my team at work. It’s designed around the kinds of events we actually deal with day to day, instead of trying to force everything into a generic calendar setup.

Right now it’s focused on our team, but it’s structured in a way that could be expanded for other teams across the organization.

---

## ✨ What it does

- Create, edit, and delete events  
- Handle multi-day and overlapping events  
- Assign staff to events  
- Filter events by type or staff  
- Manage staff (add / remove)  
- Display everything in a calendar that actually makes sense visually  

---

## 🛠 Tech

- Vue 3  
- TypeScript  
- SCSS  
- date-fns  
- Firebase / Firestore  

---

## 🧱 How it’s structured

Most of the logic lives inside the calendar feature:

- **components/** → UI (calendar, modals, forms, etc.)
- **utils/** → logic for events, dates, layout, etc.
- **services/** → Firestore calls

Outside of that:

- **stores/** → app state (events and staff)
- **styles/** → global styles and tokens

One thing that matters here:  
figuring out *where events go* in the calendar is handled separately from how they’re displayed. That keeps the UI a lot simpler.

---

## 🧠 How I approached this

A couple things I tried to keep consistent while building this:

- Layout logic lives outside of components so the UI doesn’t get messy
- Things behave the same way across the app — no surprises
- I build on existing patterns instead of introducing new ones constantly
- The UI is intentionally simple — no heavy animations, just clear and readable
- Staff identity (names, avatars, etc.) is handled consistently everywhere

---

## 🗄 Data

Events and staff are stored in Firestore.

There’s a small service layer that handles:
- fetching data
- creating / updating / deleting records

Stores then hold that data for the rest of the app.

---

## 🎨 Styling

- SCSS with shared variables (tokens)
- Consistent look across the app
- Recently cleaned up to remove legacy CSS

---

## 🚀 Running the app

```bash
npm install
npm run dev
```

You’ll need Firebase environment variables:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 🔮 Future ideas

- Auto-generated holidays and birthdays  
- Multi-team support  
- More polish and documentation  

---

## 📝 Notes

This was built to solve a real problem for my team, so the focus has always been on keeping it practical and easy to work with.

It’s something I can keep building on as needs change.
