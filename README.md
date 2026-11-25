# ORBIT ATELIER

A premium fashion storefront concept built around a dark, gold-accented visual identity and an immersive portal entrance.

## Project status

**In development — not yet accepting real orders or payments.**

The current `index.html` is a front-end prototype. Its product catalogue contains sample products and prices. Its previous demo checkout stored orders in the visitor's browser only. Do not use it to collect real customer details.

## Planned production architecture

- **Storefront:** responsive product catalogue, product details, sizes, stock availability, cart and checkout.
- **Database:** Supabase Postgres for products, variants/inventory, orders and order items.
- **Seller area:** authenticated seller login and private order-management dashboard.
- **Order handling:** server-side validation through a Supabase Edge Function. Customer phone numbers and delivery addresses must never be exposed through public product APIs.
- **Payments:** integrate a supported payment provider only after the business account and settlement details are set up and tested.
- **Deployment:** deploy the storefront from this GitHub repository and connect a custom domain when ready.

## Security requirements

- Enable Row Level Security on all exposed database tables.
- Public visitors may read only active product information.
- Customer and order records are private to authorized seller accounts.
- Never put a Supabase secret/service-role key in browser code or GitHub.
- Validate product prices, quantities, stock and order totals on the server; never trust totals sent by the browser.
- Collect only customer details needed to fulfil an order and protect them from public access.

## Launch checklist

- [ ] Restore Supabase project and confirm database health.
- [ ] Inspect existing database objects before adding schema.
- [ ] Create product, variant/inventory, order and order-item tables with RLS.
- [ ] Deploy and test secure order-submission function.
- [ ] Replace sample catalogue with the owner's real products, photos, prices and available sizes.
- [ ] Build seller authentication and order dashboard.
- [ ] Choose and configure a payment provider; test in sandbox mode first.
- [ ] Confirm delivery areas, fees, fulfilment process, returns and customer contact method.
- [ ] Deploy website, connect domain and test on mobile.
- [ ] Complete privacy, security and end-to-end order tests before launch.

## Development notes

The project is maintained in the `main` branch. Keep credentials and private customer information out of source control.
