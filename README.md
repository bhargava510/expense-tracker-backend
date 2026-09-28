# Expense Tracker — Backend

Node.js + Express REST API backed by PostgreSQL.

## Structure

```
expense-tracker-backend/
├── docker-compose.yml           # optional local Postgres
├── .env.example
└── src/
    ├── server.js                # starts the HTTP server
    ├── app.js                   # express app: middleware + routes
    ├── config/
    │   ├── env.js               # reads/validates environment variables
    │   ├── db.js                # pg connection pool
    │   └── periods.js           # ★ dashboard frequencies (add new ones here)
    ├── db/
    │   ├── schema.sql           # tables, indexes, default categories
    │   ├── init.js              # npm run db:init
    │   └── seed.js              # npm run db:seed (sample data)
    ├── routes/                  # URL → controller mapping
    ├── controllers/             # request/response handling
    ├── services/                # SQL / business logic
    ├── validators/              # input validation
    ├── middleware/              # 404 + error handler
    └── utils/                   # HttpError, asyncHandler, date helpers
```

Request flow: `routes → controllers → services → PostgreSQL`.

## Setup

```bash
docker compose up -d        # or use your own Postgres and `createdb expense_tracker`
cp .env.example .env        # adjust DATABASE_URL / CORS_ORIGIN if needed
npm install
npm run db:init             # create tables + default categories
npm run db:seed             # optional: ~14 months of sample expenses
npm run dev                 # http://localhost:4000 (auto-restarts on change)
```

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | API port |
| `DATABASE_URL` | — | Postgres connection string |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated allowed frontend origins |

## Adding a dashboard frequency

One line in `src/config/periods.js`; the frontend tabs update automatically:

```js
'2years': { label: '2 Years', months: 24, bucket: 'quarter' },
```

`months` = window length ending with the current month; `bucket` = chart granularity (`day` | `week` | `month` | `quarter` | `year`).

## API

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/expenses` | query: `from`, `to`, `categoryId`, `search`, `limit`, `offset` |
| GET | `/api/expenses/:id` | |
| POST | `/api/expenses` | `{ title, amount, categoryId, spentOn: 'YYYY-MM-DD', paymentMethod?, notes? }` |
| PUT | `/api/expenses/:id` | same body as POST |
| DELETE | `/api/expenses/:id` | |
| GET | `/api/categories` | |
| POST | `/api/categories` | `{ name, color? }` |
| GET | `/api/dashboard/periods` | available frequencies |
| GET | `/api/dashboard?period=yearly&offset=0` | `offset=1` = the period before, etc. |
| GET | `/api/health` | DB connectivity check |

Errors are returned as `{ "errors": ["message", ...] }` with an appropriate status code.

## Deploy to Vercel

1. Import this repo in Vercel (Root Directory = this folder, Framework Preset = Express / Other). `src/app.js` default-exports the app, so no `vercel.json` is needed.
2. Storage → add **Neon** (Postgres) and connect it to this project → `DATABASE_URL` is set automatically.
3. Create tables once from your machine: `DATABASE_URL="<Neon DATABASE_URL_UNPOOLED>" npm run db:init` (optionally `db:seed`).
4. Set `CORS_ORIGIN` to your frontend URL (e.g. `https://expense-tracker-frontend.vercel.app`) and redeploy.
5. Check `https://<backend>.vercel.app/api/health` → `{"ok":true}`.
