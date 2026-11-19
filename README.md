# Personal Finance Manager — challenge starter

Starting point for the [Personal Finance Manager frontend challenge](docs/CHALLENGE.md):
a complete backend, and an empty React app for you to fill in.

The API exists so you can spend your time on the front end — accounts,
transactions, categories, projects, scheduled bills, reports and projections are
already there, already populated with 18 months of plausible data.

**Node + Express, entirely in memory.** No database, no migrations, no auth.
Restart and you are back to the same seed.

> The backend is **not evaluated** — it is scaffolding. You are free to use it as
> is, extend it, or throw it away and mock the API yourself. What we do want to
> talk about is the **data contract**: how accounts, transactions, categories and
> projections are modelled, and how your client consumes that model. If you
> disagree with a decision made here, that is a good discussion, not a problem.

---

## The client: what was built

[`client/`](client) is a TypeScript single-page app with four main screens
(Dashboard, Accounts & ledger, Bills & income, Expense report) and a Settings
screen for developer tools. Every screen reads from the API above; nothing is
mocked.

### Tech stack

| Concern | Choice | Why |
|---|---|---|
| Build & language | Vite 8, React 19, TypeScript | Fast dev server; types copied from `docs/api-types.d.ts` |
| Rendering | React Compiler (Babel plugin) | Automatic memoisation, so no hand-written `useMemo`/`useCallback` |
| Routing | TanStack Router (file-based) | Typed routes, with filters validated into the URL by `validateSearch` |
| Server state | TanStack Query + Axios | Query and mutation factories, grouped query keys, scoped cache invalidation |
| Forms | TanStack Form (`createFormHook`) + Zod | One `useAppForm` with shared field components; schemas mirror the server's rules |
| Tables | TanStack Table + TanStack Virtual | Virtualised ledger for long transaction lists |
| Client state | Zustand | UI-only state: which drawer is open, the selected IDs, display currency |
| UI kit | Base UI primitives (shadcn-style) styled with Tailwind CSS 4 | Accessible primitives; design tokens defined in `styles.css` |
| Charts | Recharts | Monthly spend and category breakdown |
| Dates | date-fns + react-day-picker | Local-time `YYYY-MM-DD` handling (never UTC-shifted) |
| Feedback | Sonner toasts, skeleton loaders, shared `SectionError` | Consistent loading and error states on every screen |

**Structure.** `src/features/<Feature>` holds each screen. Shared building blocks
live in `src/components/base`, including `ClickableTable`, `PageHeader`,
`OverviewItems`, `AppForm` and a lazily loaded `RootDrawer`. All API access goes
through `src/utils/api`: the endpoints, the query and mutation factories, and
`queryKeys`.

### User stories

| User story | Status | Where |
|---|---|---|
| Manage multiple accounts and their transactions | ✅ Done | **Accounts**: create, edit, archive and delete accounts. The ledger filters by account, status, category and date range, is paginated, and keeps every filter in the URL (`/accounts?account=…&status=…`) so links can be shared. Expenses can be added and edited from a drawer. |
| See each account's balance in real time, or as of a chosen date | 🟡 Partly done | Current posted and available balances appear on the Dashboard and the account cards. Past balances aren't shown yet, although the API supports `?asOf=` and balance history and the client already has a query for the history. |
| A monthly expense report by category | ✅ Done | **Expense report**: month by month, for all accounts or one. Shows total spent against the previous month, the largest category, the average per transaction, a category breakdown chart and a 6-month trend. Month and account are kept in the URL. Categories can be created, renamed or deleted, with their transactions moved to another category. |
| Store future bills and income, and see a projected budget | 🟡 Partly done | **Bills & income**: create and edit scheduled items, list upcoming occurrences over 30, 60 or 90 days, and see bills, income and net for the next 30 days. A full projected balance (the `/projections` endpoint) isn't shown yet. |

### Brand identity

The app's working identity is a calm, trustworthy personal-finance tool:
- **Colours:** deep and slate greens (`#0f221e`, `#285f57`) with warm sand and cream neutrals (`#ede6dd`, `#f7f3ee`). A mint accent (`#78ffa8`) is used sparingly for highlights.
- **Fonts:** DM Sans for body text and Manrope for headings and numbers.
- **Money colours:** green for money in and red for money out, with the sign always shown, so colour is never the only cue.
- **Tone:** plain and reassuring. Headings say what the reader is looking at ("Bills due (30 days)") rather than using finance jargon.

All of this is defined as design tokens in `client/src/assets/styles/styles.css`, so it can be refined without touching components.

### Future plans

- **Finish the two partial stories:**
  - an "as of" date picker on account details, with a balance-over-time chart (data from `balances/history`)
  - a budget projection screen built on `/projections`
- **URL state on Bills:** keep the timeframe and kind filters in the URL, as Accounts and Expenses already do.
- **Tests:** unit tests for the pure helpers (`validate*Search`, `convertCurrency`, `expensesReportQuery`), then component tests for the drawer forms.
- **Precise cache updates:** scope the remaining mutations to the query keys they affect instead of clearing the whole cache.
- **Product features:**
  - transfers between accounts
  - projects
  - live exchange rates (`CurrencyConversionMap` is a fixed placeholder)
  - dark mode, using the existing tokens
  - CSV import and export

