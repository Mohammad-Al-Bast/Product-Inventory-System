# Product Inventory System

A simple inventory management web application to manage products, suppliers, and categories with a dashboard for quick insights. Server-rendered with EJS and backed by MongoDB via Mongoose.

**Status:** Prototype / Learning project
**Stack:** Node.js, Express, EJS, MongoDB (Mongoose)

## Quick links

- Main entry: app.js
- Dependencies: package.json
- DB connector: src/config/database.js
- Routers: src/routers/product.js, src/routers/supplier.js, src/routers/category.js
- Controllers: src/controllers/product.controller.js, src/controllers/supplier.controller.js, src/controllers/category.controller.js, src/controllers/dashboard.controller.js
- Models: src/models/product.model.js, src/models/supplier.model.js, src/models/category.model.js
- Views: src/views (EJS templates)

## Contents

- Overview
- Features
- Tech stack & dependencies
- Requirements
- Installation
- Configuration
- Running the app
- Project structure
- Routes & API
- Data models
- Views & frontend notes
- Development notes & best practices
- Troubleshooting
- Contribution & license
- Contact

## Overview

This application provides CRUD operations for products, suppliers and categories. The root route renders a dashboard with inventory statistics and charts. Controllers return JSON for XHR requests where appropriate.

## Features

- Products: list, add, update, delete
- Suppliers: list, add, update, delete
- Categories: list, add, update, delete
- Dashboard: totals, low-stock alerts, inventory value, charts
- Server-rendered EJS views with optional AJAX responses

## Tech stack & dependencies

- Node.js (ES module project)
- Express 5.x
- EJS + express-ejs-layouts
- Mongoose (MongoDB)
- express-validator
- nodemon (dev)

See `package.json` for exact versions.

## Requirements

- Node.js 18+ recommended
- MongoDB running locally or accessible via a connection string

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Mohammad-Al-Bast/Product-Inventory-System.git
cd Product-Inventory-System
```

2. Install dependencies:

```bash
npm install
```

## Configuration

- Default DB connection string: `mongodb://localhost:27017/product-inventory-system` (configured in `app.js`).
- Suggested env vars (not currently wired):
    - `PORT` — server port (default 3000)
    - `MONGO_URI` — MongoDB connection URI

To make the app use environment variables, edit `app.js` and read `process.env.MONGO_URI` / `process.env.PORT` before falling back to defaults.

## Running the app

Development:

```bash
npm run dev
# starts nodemon and runs app.js
```

Then open http://localhost:3000

## Scripts

- `dev` — runs `nodemon app.js` (see `package.json`).

## Project structure

- `app.js` — server bootstrap and route mounting
- `package.json` — dependencies and scripts
- `src/`
    - `config/` — `src/config/database.js` (Mongoose connector)
    - `controllers/` — route handlers and business logic
    - `models/` — Mongoose schemas and models
    - `routers/` — Express routers for products, suppliers, categories
    - `public/` — static assets (css, js)
    - `views/` — EJS templates and layouts

## Routes & API (summary)

**Root:**

- GET `/` — Dashboard (`getDashboard` in `src/controllers/dashboard.controller.js`)

**Products (`src/routers/product.js`)**:

- GET `/products/` — list products
- GET `/products/add` — form
- POST `/products/add` — create
- POST `/products/update/:id` — update
- POST `/products/delete/:id` — delete

**Suppliers (`src/routers/supplier.js`)**:

- GET `/suppliers/` — list suppliers
- POST `/suppliers/add` — create
- POST `/suppliers/update/:id` — update
- POST `/suppliers/delete/:id` — delete

**Categories (`src/routers/category.js`)**:

- GET `/categories/` — list categories
- GET `/categories/api` — categories JSON API
- POST `/categories/add` — create
- POST `/categories/update/:id` — update
- POST `/categories/delete/:id` — delete

Notes:

- Controllers detect XHR or `Accept: application/json` and return JSON responses for AJAX-compatible flows.
- Update and delete endpoints attempt to match both custom `id` and MongoDB `_id`.

## Data models (Mongoose schemas)

- **Product (`src/models/product.model.js`)**
    - id: String (unique, required)
    - name: String (required)
    - sku: String (unique)
    - category: String
    - price: Number
    - quantity: Number
    - supplier: String
    - description: String
    - timestamps: enabled

- **Supplier (`src/models/supplier.model.js`)**
    - id: Number (unique, required)
    - name, email (unique), phone, address, city, state, zip, country (default: Lebanon), notes
    - timestamps: enabled

- **Category (`src/models/category.model.js`)**
    - id: Number (unique)
    - name: String (unique)
    - description, color (default `#3498db`), icon (default `fa-tag`), status (`active`|`inactive`)
    - timestamps: enabled

## Views & frontend

- Server-rendered EJS templates live in `src/views`. Layout handled by `express-ejs-layouts` with the main layout at `src/views/layouts/main.ejs`.
- Static assets are served from `src/public`.
- Client scripts in `src/public/js` provide modal handling and AJAX interactions.

## Development notes & suggestions

- Wire `MONGO_URI` and `PORT` environment variables in `app.js` for flexible deployments.
- Add input validation middleware using `express-validator` on routes that create/update resources.
- Normalize ID types (strings vs numbers) across models and controllers to avoid lookup issues.
- Add unit and integration tests for controllers and data-access logic.
- Add centralized error-handling middleware and request logging for production readiness.
- Consider containerizing with Docker for consistent deployments.

## Troubleshooting

- Database connection issues: ensure MongoDB is running and the connection string is correct in `app.js`.
- Duplicate key errors: unique fields (`id`, `sku`, `email`, `name`) may conflict when seeding—inspect the DB and remove duplicates or adjust schema/indexes.
- Views not rendering: confirm `app.set("views", "./src/views")` and `app.set("view engine", "ejs")` in `app.js`.

## Security & hardening (basic)

- Use environment variables or secret manager for DB credentials.
- Sanitize and validate all inputs; enforce server-side validation.
- Add authentication/authorization if the app will be used by multiple users.
- Limit error detail returned to clients in production.

## Contribution

- Fork the repo, create a branch per feature/bugfix, include tests, and open a pull request.
- Use issues to discuss larger changes before implementing.

## License

- Per `package.json`, license is `ISC`. Update to your preferred license if needed.

## Contact

- Repository: https://github.com/Mohammad-Al-Bast/Product-Inventory-System
- Open an issue on the repo for questions or support.

---

If you want I can:

- write this into the repository `README.md` now (done), or
- create a short `CONTRIBUTING.md` and add environment-variable wiring in `app.js`.
