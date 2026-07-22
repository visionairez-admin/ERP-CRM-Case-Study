# Backend Architecture & Responsibilities

This backend is built using **Node.js, Express, TypeScript, and Prisma ORM**. It follows a Feature-Based Modular Architecture to keep the codebase clean, scalable, and maintainable.

## Folder Structure

```
backend/
├── prisma/               # Prisma schema and database migrations
├── src/
│   ├── config/           # Environment variables, database and JWT setup
│   ├── controllers/      # (Optional) Global controllers, though mostly in modules/
│   ├── middlewares/      # Authentication, RBAC, Error Handling
│   ├── modules/          # Feature-based module grouping (see below)
│   ├── utils/            # Shared utilities (pagination, helpers, constants)
│   ├── validators/       # Zod validation schemas
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Server entry point
```

## Feature-Based Modules

Each feature (module) handles its own routes, controllers, and services. The active modules are:

- `auth`: Login, Logout, Refresh Token, Protected Routes.
- `customers`: Customer CRUD operations.
- `products`: Product CRUD and Categories management.
- `inventory`: Stock IN/OUT and Movement History.
- `sales`: Sales Challan creation and auto stock reduction.
- `analytics`: Dashboard KPIs and charts.

### Internal Module Architecture

Within each module, the flow of data follows this clean architecture pattern:

```text
Routes -> Controllers -> Services -> Repositories -> Prisma ORM -> PostgreSQL
```

- **Routes:** Maps HTTP endpoints to controller methods.
- **Controllers:** Parses HTTP requests, validates inputs, and sends HTTP responses. Controllers remain thin.
- **Services:** Contains all business logic (e.g., checking stock before a sale).
- **Repositories:** Handles direct database interactions (Prisma queries).

## Database Schema (ER Diagram)

Below is the Entity-Relationship (ER) diagram for the core entities managed by this backend.

```mermaid
erDiagram
    users {
        String id PK
        String name
        String email UK
        String password_hash
        Role role
        Boolean is_active
        DateTime created_at
        DateTime updated_at
    }

    refresh_tokens {
        String id PK
        String user_id FK
        String token UK
        DateTime expires_at
        Boolean revoked
        DateTime created_at
    }

    customers {
        String id PK
        String business_name
        String contact_name
        String email
        String phone
        String gst_number
        String address
        CustomerStatus status
        String notes
        DateTime created_at
        DateTime updated_at
    }

    categories {
        String id PK
        String name UK
    }

    products {
        String id PK
        String category_id FK
        String sku UK
        String name
        Decimal price
        Int current_stock
        Int minimum_stock
        Boolean is_active
        DateTime created_at
        DateTime updated_at
    }

    inventory_movements {
        String id PK
        String product_id FK
        MovementType movement_type
        Int quantity
        String reason
        String created_by FK
        DateTime created_at
    }

    sales {
        String id PK
        String customer_id FK
        String challan_number UK
        Decimal total_amount
        SaleStatus status
        String notes
        String created_by FK
        DateTime created_at
        DateTime updated_at
    }

    sale_items {
        String id PK
        String sale_id FK
        String product_id FK
        Int quantity
        Decimal unit_price
        Decimal total_price
    }

    users ||--o{ refresh_tokens : "owns"
    users ||--o{ inventory_movements : "creates"
    users ||--o{ sales : "creates"
    customers ||--o{ sales : "places"
    categories ||--o{ products : "classifies"
    products ||--o{ inventory_movements : "tracked in"
    products ||--o{ sale_items : "included in"
    sales ||--o{ sale_items : "contains"
```
