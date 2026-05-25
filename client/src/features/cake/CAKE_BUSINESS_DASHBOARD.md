# Cake Business Dashboard — Setup

ForestGift’s **Cake Dashboard** (`client/src/features/cake/`) now includes expense tracking, PDF invoices, earnings analytics, and Excel exports. Changes are scoped to the cake module and cake API routes; admin, NGO, and user dashboards are unchanged.

## Dependencies

Already in `client/package.json` (no new installs required):

- `jspdf` — invoice PDF generation
- `xlsx` — Excel exports
- `recharts` — charts on Expenses & Earnings pages

If you clone fresh:

```bash
cd client && npm install
cd ../server && npm install
```

## Environment

**Client** (`client/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

**Server** (`server/.env`):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/forestgift
PORT=5000
```

## Run locally

```bash
# Terminal 1 — API
cd server
npm run dev

# Terminal 2 — SPA
cd client
npm run dev
```

Log in as a cake vendor (e.g. `indore@cakes.com` after seed). Open `/dashboard`.

## Database (new collections)

MongoDB collections are created automatically on first use:

| Collection      | Purpose                                      |
|-----------------|----------------------------------------------|
| `cakeexpenses`  | Vendor operational expenses by category      |
| `cakeinvoices`  | One invoice per assigned order (unique per vendor + user) |

No migration script is required.

## API endpoints (cake only)

Base: `/api/cake/vendor/:vendorId/...`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/expenses` | List expenses (query: `start`, `end`, `category`) |
| POST | `/expenses` | Create expense |
| PATCH | `/expenses/:expenseId` | Update expense |
| DELETE | `/expenses/:expenseId` | Delete expense |
| GET | `/expenses/analytics` | Daily/weekly/monthly + charts data |
| GET | `/invoices` | List invoices (auto-created for orders) |
| GET | `/invoices/:invoiceId` | Single invoice |
| POST | `/invoices/generate/:userId` | Refresh invoice for order |
| PATCH | `/invoices/:invoiceId/payment` | Update payment status |
| GET | `/earnings` | Revenue, profit, trends, order stats |
| GET | `/finance/overview` | Dashboard KPI summary |

Invoices are also created/updated when delivery status changes (`PATCH /api/cake/vendor/delivery`).

## New UI routes (in-app navigation)

| Path | Page |
|------|------|
| `/` | Dashboard + business KPIs |
| `/deliveries` | All deliveries |
| `/earnings` | Revenue & analytics |
| `/expenses` | Expense CRUD & reports |
| `/invoices` | PDF download, print, email-ready |
| `/profile` | Shop profile |

## New client files

- `api/finance.ts` — API client
- `utils/invoicePdf.ts` — PDF template
- `utils/excelExport.ts` — `.xlsx` exports
- `pages/ExpensesPage.tsx`, `EarningsPage.tsx`, `InvoicesPage.tsx`
- `components/CakeSidebar.tsx`, `CakePageHeader.tsx`, `DateRangeFilter.tsx`, `LoadingState.tsx`

## GST & pricing

- Default GST: **18%** on invoice subtotal (`vendor.costPerCake` or ₹500 default).
- Revenue uses citizen `amount` when set, otherwise `costPerCake`.

## Excel export

Available on Expenses, Earnings, and Invoices pages. Apply date filters first, then click **Export Excel**.

## Troubleshooting

- **Empty dashboard**: Ensure users have `cakeVendor` set to your vendor id (e.g. `VND001`).
- **API errors**: Confirm `VITE_API_URL` and server `MONGODB_URI`.
- **No invoices**: Open Invoices page or accept an order — invoices sync on load and status updates.
