# Skill99 CRM — Frontend

Vite + React app for **Admin** and **Sales**. Talks to `skill99-crm-backend`.

## Setup

```bash
cd skill99-crm-frontend
cp .env.example .env
npm install
npm run dev
```

UI: `http://localhost:5174`

## Portals

| Path | Who | Features |
|------|-----|----------|
| `/login` | Staff | Sign in |
| `/admin/*` | ADMIN | Full CRM + reports + users + org settings |
| `/sales/*` | SALES | Leads + clients + projects + payments + meetings + tasks |
| `/apply` | Public | Lead capture form |
| `/reviews/:slug` | Public | Reviews page |

## Modules in sidebar

Dashboard · Leads · Pipeline · Clients · Projects · Retainers · Payments · Messages · Meetings · Tasks · Reports (admin) · Users (admin) · Settings
