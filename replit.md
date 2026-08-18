# Wedding Invitation

## Overview

This project is a single-page wedding invitation with an animated envelope reveal, countdown timer, local couple photo, event details, and RSVP interaction. It is served by a small Express server (`server.js`, port 5000) that also records when a guest opens their personalised `/?to=Name` link into the built-in PostgreSQL database (`invitation_visits` table). A private guest-opens page lives at `/guests?key=<GUEST_LIST_KEY>` with a CSV export at `/guests.csv?key=...`; the key is the `GUEST_LIST_KEY` shared env var. Deployment target is autoscale (`node server.js`).

## User preferences

- Keep the invitation elegant, warm, and responsive.
- Prefer the uploaded couple photos over remote placeholder photography.