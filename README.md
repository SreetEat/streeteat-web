# StreetEat — Customer Web App

The first of four planned portals (customer, vendor, delivery partner, admin),
built against the verified StreetEat backend API.

## Setup

```
npm install
cp .env.example .env   # only if your backend isn't on localhost:8080
npm run dev
```

Opens on http://localhost:5173. Requires the backend running (e.g.
`docker compose -f docker/docker-compose.yml up` from the backend repo) with
the CORS fix from SecurityConfig.java applied — otherwise the browser will
block every request to the API.

## What's implemented

- Register / log in (JWT stored in localStorage)
- Browse vendors (GET /api/vendors)
- View a vendor's menu, add items to a single-vendor cart
- Checkout and place a real order (POST /api/orders) — price is computed
  server-side, never sent from the client, matching the backend's
  price-tampering protection
- Order status page, polling every 8s

## What's NOT implemented yet (honest gaps)

- Vendor nearby/location-based search (backend supports /api/vendors/nearby,
  UI doesn't use it yet — currently lists all vendors)
- Order history (only the order you just placed is viewable, via its direct
  URL)
- Reviews
- Payment UI (backend payment processing is itself a stub — see
  PaymentService)
- Delivery partner tracking on a map
- Vendor, delivery partner, and admin portals (separate apps, planned next)
- Responsive polish beyond basic mobile breakpoints — tested down to mobile
  width but not extensively
