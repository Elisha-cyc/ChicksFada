# ORBIT ATELIER

A luxury fashion storefront with a dark, gold-accented identity and an immersive portal entrance.

## Current build status

The storefront in `index.html` now connects to the Supabase backend. The backend schema, product-image bucket, private seller access checks and server-side order function have been created.

**Not yet launched for public customers.** Before accepting real orders:
- Enable GitHub Pages for this repository.
- Add the published site URL to Supabase Auth's Site URL and Redirect URLs.
- Sign in to the seller portal using the approved administrator email and verify the magic-link flow.
- Add the real product photos, prices, sizes and stock.
- Test a complete order and fulfilment process on mobile.
- Have a parent/guardian help review customer-data handling, business arrangements and any applicable local requirements before collecting real customer information.

## Features now connected

- Public catalogue reads active products from Supabase.
- Shirt and trouser category filters.
- Product sizes and stock availability.
- Cart and server-side checkout.
- Prices and stock are checked in the database at checkout; order totals are not trusted from the browser.
- Stock is reduced and the order plus line items are recorded in one database transaction.
- Pay on delivery is the only payment method configured; no card or mobile-money payment credentials are collected.
- Private seller portal uses email magic-link authentication.
- Seller can add products, upload multiple product photos from a phone, update stock and prices, hide products, and update order statuses.
- Customer names, phone numbers, delivery addresses and orders are restricted to the authorized seller account.

## Backend

- Supabase project: `ljinttjwpnuhwakocvzq`
- Product tables: `oa_products`, `oa_product_sizes`, `oa_product_images`
- Order tables: `oa_orders`, `oa_order_items`
- Product photos: public bucket `oa-product-images`; uploads, replacements and deletions are restricted by Storage policies to the approved seller.
- Checkout Edge Function: `oa-create-order`
- Database checkout functions: `oa_place_order` and `oa_consume_checkout_rate`
- Seller authorization: `oa_is_admin`, which checks the authenticated email against the private owner allowlist.

Only the Supabase **publishable** key is used in browser code. Never put a Supabase secret or service-role key in this repository or any browser code.

## Free deployment

GitHub Pages and Supabase Free can be used to start without buying hosting or a domain. Free services have usage limits and may pause inactive projects; storage, bandwidth, email delivery and database quotas should be monitored. Payment-provider fees are not included because payments are not integrated.

### Enable GitHub Pages

1. Open this repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/(root)`, then save.
5. GitHub Pages should publish the site at `https://elisha-cyc.github.io/ChicksFada/` once deployment finishes.

### Configure Supabase email redirects

In the Supabase project, open **Authentication → URL Configuration**:
- Set the Site URL to `https://elisha-cyc.github.io/ChicksFada/`.
- Add `https://elisha-cyc.github.io/ChicksFada/**` to the Redirect URLs allowlist.

The seller portal sends a one-time email sign-in link; no password is needed in the website.

## Important launch checks

- [ ] GitHub Pages deployment is enabled and the live URL loads over HTTPS.
- [ ] Supabase Auth redirect URLs are configured.
- [ ] The approved seller email receives a magic link and reaches the private dashboard.
- [ ] A non-owner account cannot open seller tools or view customer orders.
- [ ] Upload several product photos from an iPhone.
- [ ] Verify product sizes, stock, prices and category filters.
- [ ] Place a test order, confirm stock is reduced once, and update its status.
- [ ] Verify the public site cannot read customer contact details or order records.
- [ ] Review privacy, fulfilment, returns and customer support arrangements with a parent/guardian before launch.

## Existing project note

This Supabase project also contains older, unrelated language-learning tables. ORBIT ATELIER uses its own `oa_*` tables and policies; those older tables have not been modified.
