# ICT Lab Key Tracker

React (JSX) + plain CSS (CSS Modules) + React Router. No backend; data lives in `localStorage`.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Structure

- `src/pages/Dashboard.jsx` – stats, active checkouts (with Return), recent transactions
- `src/pages/CheckOutKey.jsx` – validated checkout form
- `src/components/` – Layout, Button, Card, StatCard, FormField, ActiveCheckoutsTable, TransactionList, Badges, Toast, Icon
- `src/styles/global.css` – colours, resets; each component has its own `*.module.css`
- `src/lib/store.jsx` – state + localStorage persistence (single source of truth)
- `src/lib/data.js` – labs, 24 keys, sample records
- `src/lib/validation.js` – form rules

## Notes

- 4 labs x 6 keys = 24 keys. A key with no return date cannot be selected or issued.
- Collection time is stamped automatically at submit.
- Footer link "Reset sample data" restores the demo state before a presentation.
# keytracker
