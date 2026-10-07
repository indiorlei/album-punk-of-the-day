# Punk Album of the Day

A Next.js and Tailwind app that picks one of the 250 catalog albums each day.

The draw uses the date in the `America/Sao_Paulo` time zone as its seed. This keeps the result the same throughout the whole day, even after restarts or a new deploy. If today's result matches yesterday's, the algorithm advances to the next album, preventing repeats on consecutive days.

## Run locally

```bash
npm install
npm run dev
```
