# ERP + CRM Wholesale Distribution System

A full-stack enterprise resource planning and customer relationship management system designed for wholesale and distribution businesses. Built with modern technologies to demonstrate strong Computer Science and Software Engineering fundamentals.

## Project Overview

This is a technical assessment project showcasing:
- **Full Stack Development**: Complete implementation from database to UI
- **Clean Architecture**: Layered architecture with separation of concerns
- **Enterprise Patterns**: Role-based access control, JWT authentication, transaction handling
- **Database Design**: Normalized relational schema with proper constraints
- **REST API Design**: RESTful endpoints with proper HTTP semantics
- **Responsive UI**: Modern admin dashboard with Tailwind CSS
- **Production-Ready Code**: Error handling, validation, and security best practices

## Features

### 1. **Authentication & Authorization**
- JWT-based authentication with access and refresh tokens
- Role-based access control (RBAC)
- Four user roles: Admin, Sales, Warehouse, Accounts
- Protected routes and API endpoints
- HttpOnly cookie for refresh token storage

### 2. **Dashboard**
- Real-time metrics: Total customers, products, sales, revenue
- Recent sales transactions overview
- Low stock product warnings
- Interactive cards with color-coded indicators

### 3. **Customer CRM**
- Add, edit, delete customers (B2B)
- Customer details: Business name, contact, phone, email, GST, address
- Search and pagination
- Status management (Active/Inactive)
- Notes for customer relationship tracking

### 4. **Product Management**
- Product inventory with categories
- Fields: SKU (unique), name, price, current stock, minimum stock
- Category-based organization
- Stock level alerts
- Product lifecycle management

### 5. **Inventory Management**
- Real-time stock tracking
- Stock IN/OUT movements
- Movement history and audit trail
- Prevent negative stock with validation
- Warehouse staff controls

### 6. **Sales Challan (Billing)**
- Create sales transactions
- Select multiple products per challan
- Auto-calculate total amount
- Store price snapshot for historical accuracy
- Automatic inventory reduction on sale
- Generate unique challan numbers

### 7. **Analytics Module**
- Dashboard metrics calculation
- Sales trends analysis
- Inventory insights
- Revenue tracking

## Technology Stack

### Frontend
- **React 19** - Latest UI framework
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Router 7** - Client-side routing
- **Axios** - HTTP client with interceptors
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Efficient form handling
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - HTTP framework
- **TypeScript** - Type safety
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Database
- **PostgreSQL** - Production-grade relational DB
- **Prisma** - Modern ORM with migrations

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Render
- **Database**: Supabase PostgreSQL

## Project Structure

```
erp-crm-case-study/
├── backend/
│   ├── src/
│   │   ├── config/           # Environment, Prisma, utilities
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── repositories/     # Data access layer
│   │   ├── middlewares/      # Auth, validation, error handling
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/
│   │   │   ├── customers/
│   │   │   ├── products/
│   │   │   ├── inventory/
│   │   │   ├── sales/
│   │   │   └── analytics/
│   │   ├── validators/       # Validation schemas
│   │   ├── utils/            # Helper functions
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed script with demo data
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── shared/       # ProtectedRoute, Layout
│   │   │   └── ui/           # Button, Card, Badge, Table, etc.
│   │   ├── pages/            # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Inventory.tsx
│   │   │   └── Sales.tsx
│   │   ├── layouts/          # DashboardLayout
│   │   ├── context/          # AuthContext
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client
│   │   ├── utils/            # Helper functions
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   └── package.json
│
├── .env                       # Environment variables
├── package.json              # Root workspace package
└── README.md                 # This file
```

## ER Diagram

```
Users (1) ──── (*) RefreshTokens
  │
  ├──── (*) Sales (created_by)
  └──── (*) InventoryMovements (created_by)

Customers (1) ──── (*) Sales

Products (1) ──────────┐
  │                    ├──── (*) SaleItems (1)
  ├─ Category (1) ──┐  │
  │                 │  │
  └──── (*) InventoryMovements

Sales (1) ──── (*) SaleItems
```

## Database Schema

### Users Table
```sql
- id (UUID, PK)
- name (String)
- email (String, UNIQUE)
- password_hash (String)
- role (Enum: ADMIN, SALES, WAREHOUSE, ACCOUNTS)
- is_active (Boolean, default: true)
- created_at, updated_at (Timestamps)
```

### Customers Table
```sql
- id (UUID, PK)
- business_name (String)
- contact_name (String)
- email (String, Optional)
- phone (String)
- gst_number (String, Optional)
- address (String, Optional)
- status (Enum: ACTIVE, INACTIVE)
- notes (Text, Optional)
- created_at, updated_at (Timestamps)
```

### Products Table
```sql
- id (UUID, PK)
- category_id (UUID, FK)
- sku (String, UNIQUE)
- name (String)
- price (Decimal 10,2)
- current_stock (Integer, default: 0)
- minimum_stock (Integer, default: 0)
- is_active (Boolean, default: true)
- created_at, updated_at (Timestamps)
```

### Sales Table
```sql
- id (UUID, PK)
- customer_id (UUID, FK)
- challan_number (String, UNIQUE)
- total_amount (Decimal 10,2)
- status (Enum: DRAFT, CONFIRMED, CANCELLED)
- notes (Text, Optional)
- created_by (UUID, FK to Users)
- created_at, updated_at (Timestamps)
```

### SaleItems Table
```sql
- id (UUID, PK)
- sale_id (UUID, FK)
- product_id (UUID, FK)
- quantity (Integer)
- unit_price (Decimal 10,2) -- Snapshot at sale time
- total_price (Decimal 10,2)
```

### InventoryMovements Table
```sql
- id (UUID, PK)
- product_id (UUID, FK)
- movement_type (Enum: IN, OUT)
- quantity (Integer)
- reason (String, Optional)
- created_by (UUID, FK to Users)
- created_at (Timestamp)
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and revoke tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info (protected)

### Customers
- `GET /api/customers?page=1&limit=10&search=term` - List customers with pagination
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Products
- `GET /api/products?page=1&limit=10&search=term&categoryId=id` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - Get all categories

### Inventory
- `GET /api/inventory/movements?page=1&limit=10&productId=id` - Get movement history
- `POST /api/inventory/movements` - Record manual stock adjustment

### Sales
- `GET /api/sales?page=1&limit=10&customerId=id` - List sales
- `GET /api/sales/:id` - Get sales details
- `POST /api/sales` - Create sales challan

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard metrics

## Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy .env template (already included in root)
   # Edit .env with your database credentials
   ```

4. **Setup database and run migrations**
   ```bash
   npm run prisma:migrate -- --name init
   ```

5. **Seed database with demo data**
   ```bash
   npm run prisma:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:5173`

### Full Stack Development

From the root directory:
```bash
npm run dev        # Run both backend and frontend
npm run build      # Build both
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# ── Server ──────────────────────────
NODE_ENV=development
PORT=5000

# ── Database ────────────────────────
# Local PostgreSQL setup
DATABASE_URL="postgresql://postgres:sasy1234567@localhost:5432/erp_crm_db?schema=public"

# ── JWT ─────────────────────────────
JWT_ACCESS_SECRET=your_super_secret_access_key_here_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── CORS ────────────────────────────
CLIENT_URL=http://localhost:5173

# ── Cookie ──────────────────────────
COOKIE_SECRET=your_cookie_secret_here_min_32_chars
```

## Demo Credentials

After seeding, login with these credentials:

| Role      | Email                    | Password     |
|-----------|--------------------------|--------------|
| Admin     | admin@wholesale.com      | password123  |
| Sales     | sales@wholesale.com      | password123  |
| Warehouse | warehouse@wholesale.com  | password123  |
| Accounts  | accounts@wholesale.com   | password123  |

## Business Logic & Architecture

### Clean Layered Architecture
```
Routes → Controllers → Services → Repositories → Database
                         ↓
                  Business Logic
```

**Controllers**: Handle HTTP requests, validate input, call services
**Services**: Contain business logic, call repositories
**Repositories**: Database access layer, Prisma queries
**Middlewares**: Auth, validation, error handling

### Key Features

1. **Authentication Flow**
   - User logs in with email/password
   - Password verified using bcrypt
   - JWT tokens generated (access + refresh)
   - Refresh token stored with expiry
   - Frontend stores access token in localStorage
   - Automatic token refresh on 401 response

2. **Sales Transaction Flow**
   - Select customer
   - Choose products with quantities
   - Calculate total automatically
   - Generate unique challan number
   - Create transaction in database
   - Reduce product inventory atomically
   - Record inventory movement audit trail
   - Return challan with items and amounts

3. **Role-Based Access Control**
   - Admin: Full system access
   - Sales: Create/view sales, manage customers
   - Warehouse: Manage inventory and stock
   - Accounts: View financial reports

4. **Data Validation**
   - Frontend: Zod schemas with React Hook Form
   - Backend: express-validator + Zod
   - Email, phone, required fields validation
   - Unique SKU enforcement
   - Positive number validation

## Security Measures

1. **Authentication**
   - Passwords hashed with bcryptjs (10 rounds)
   - JWT tokens with expiry
   - Refresh token rotation
   - HttpOnly cookies for sensitive data

2. **Authorization**
   - Role-based middleware checks
   - Protected API endpoints
   - Frontend route protection

3. **Data Protection**
   - SQL injection prevention via Prisma
   - Input validation on frontend and backend
   - CORS configured to trusted origin
   - Environment variables for secrets

4. **Database**
   - Foreign key constraints
   - Transaction support for multi-step operations
   - Audit trail for inventory movements
   - Automatic timestamps

## Code Quality

- **TypeScript** throughout for type safety
- **ESLint** for code consistency
- **Single Responsibility Principle** - small, focused functions
- **DRY** - reusable components and utilities
- **Error Handling** - comprehensive try-catch and error middleware
- **Comments** - clear documentation where needed
- **Naming** - descriptive and consistent variable names

## Performance Optimizations

1. **Frontend**
   - Lazy loading with React Router
   - Pagination on list pages
   - API response caching concept
   - Efficient re-renders

2. **Backend**
   - Database indexing (PK, FK, unique fields)
   - Query optimization with Prisma select
   - Transaction handling for data consistency
   - Request validation early exit

3. **Database**
   - Proper normalization
   - Indexed columns for searches
   - Foreign key relationships
   - Enum types for fixed values

## Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Connect Render to repository
3. Set environment variables
4. Deploy

**Environment Variables on Render:**
- `NODE_ENV=production`
- `DATABASE_URL=` (Supabase PostgreSQL URL)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `COOKIE_SECRET`
- `CLIENT_URL=` (Frontend URL on Vercel)

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Set build command: `npm run build`
4. Set start command: `npm run preview`

**Environment Variables on Vercel:**
- `VITE_API_BASE_URL=` (Backend URL from Render)

### Database Setup (Supabase)

1. Create Supabase project
2. Copy PostgreSQL connection string
3. Use as `DATABASE_URL` in backend env vars
4. Run migrations on deployed database

## Testing

### Manual Testing Workflow

1. **Login**
   - Test all 4 user roles
   - Verify JWT token generation
   - Test token refresh
   - Test logout

2. **Customers**
   - Create customer with valid data
   - Attempt duplicate GST (should fail)
   - Search by name
   - Edit and delete
   - Verify pagination

3. **Products**
   - Create product with unique SKU
   - Attempt duplicate SKU (should fail)
   - Update price and stock
   - Test category filtering
   - Delete product

4. **Inventory**
   - Record stock IN movement
   - Record stock OUT movement
   - Verify stock levels update
   - Check movement history

5. **Sales**
   - Create challan with multiple items
   - Verify inventory reduces
   - Check challan number uniqueness
   - View sales history
   - Verify price snapshot accuracy

## Future Improvements

1. **Features**
   - Purchase orders from suppliers
   - Multi-warehouse support
   - Pricing tiers based on quantity
   - Automated reorder points
   - Email/SMS notifications

2. **Analytics**
   - Advanced reporting with date ranges
   - Sales trends and forecasting
   - Customer segmentation
   - Product performance metrics
   - Profit margin analysis

3. **Integration**
   - Payment gateway integration
   - Accounting software APIs
   - Email service integration
   - SMS notifications
   - Cloud storage for documents

4. **Enhancements**
   - Dark/light theme toggle
   - Internationalization (i18n)
   - Offline mode
   - Mobile app (React Native)
   - Advanced search and filtering

## Project Learning Outcomes

This project demonstrates:

✅ **Full Stack Capability** - Complete application from database to UI  
✅ **Clean Code** - Modular, maintainable, well-organized  
✅ **System Design** - Proper architecture and patterns  
✅ **Database Design** - Normalized schema with relationships  
✅ **Security** - Authentication, authorization, data protection  
✅ **API Design** - RESTful, well-structured endpoints  
✅ **Error Handling** - Comprehensive error management  
✅ **Validation** - Input validation on multiple layers  
✅ **TypeScript** - Strong typing and type safety  
✅ **Testing Knowledge** - Understanding of testing strategies  
✅ **Deployment** - Ready for production deployment  

## Getting Help

For issues or questions:

1. Check the API endpoint documentation above
2. Verify environment variables are set correctly
3. Check database connection
4. Review error logs in backend console
5. Inspect network requests in browser DevTools

## License

This project is created for educational and assessment purposes.

---

**Built with ❤️ demonstrating Software Engineering Excellence**
