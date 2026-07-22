# Architecture Overview

Complete technical architecture of the ERP-CRM system.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│  React 19 SPA (TypeScript)                                          │
│  ├── Components (UI, Pages, Layouts)                               │
│  ├── Context (Auth State Management)                               │
│  ├── Hooks (Custom React Hooks)                                    │
│  └── Services (Axios HTTP Client)                                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTP/REST API
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                      API GATEWAY LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│  Express.js Server (TypeScript)                                     │
│  ├── CORS Middleware                                               │
│  ├── Authentication Middleware (JWT Verify)                        │
│  ├── Authorization Middleware (RBAC)                               │
│  ├── Request Validation Middleware                                 │
│  └── Global Error Handler                                          │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                    APPLICATION LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  Modular Architecture:                                              │
│                                                                     │
│  ┌─────────────────────┬─────────────────────┬──────────────────┐ │
│  │  Auth Module        │  Customers Module   │ Products Module  │ │
│  │  ├── Controller     │  ├── Controller     │ ├── Controller   │ │
│  │  ├── Service        │  ├── Service        │ ├── Service      │ │
│  │  ├── Repository     │  ├── Repository     │ └── Repository   │ │
│  │  └── Routes         │  └── Routes         │                  │ │
│  └─────────────────────┴─────────────────────┴──────────────────┘ │
│                                                                     │
│  ┌─────────────────────┬─────────────────────┬──────────────────┐ │
│  │ Inventory Module    │  Sales Module       │ Analytics Module │ │
│  │ ├── Controller      │  ├── Controller     │ ├── Controller   │ │
│  │ ├── Service         │  ├── Service        │ ├── Service      │ │
│  │ ├── Repository      │  ├── Repository     │ └── Repository   │ │
│  │ └── Routes          │  └── Routes         │                  │ │
│  └─────────────────────┴─────────────────────┴──────────────────┘ │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                   DATA ACCESS LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Prisma ORM (TypeScript)                                            │
│  ├── Query Building                                                │
│  ├── Type Safety                                                   │
│  ├── Migrations                                                    │
│  └── Schema Validation                                             │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ SQL Queries
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                    DATABASE LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Relational Database)                                   │
│  ├── Tables (Users, Customers, Products, Sales, etc.)             │
│  ├── Relationships (Foreign Keys)                                  │
│  ├── Constraints (PK, FK, Unique, Check)                          │
│  ├── Indexes (PK, FK, Search Fields)                              │
│  └── Transactions (Atomic Operations)                              │
└─────────────────────────────────────────────────────────────────────┘
```

## Layered Architecture Pattern

### Request Flow
```
Browser Request
    ↓
Frontend (React)
    ↓
HTTP Request (Axios)
    ↓
Express Server
    ↓
Middleware Stack (Auth, Validation, RBAC)
    ↓
Router (Routes)
    ↓
Controller (Request Handler)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓
Response (Data)
```

### Responsibility Separation

**Controller Layer**
- Receives HTTP requests
- Parses input
- Calls appropriate service
- Returns response via response utility

**Service Layer**
- Business logic implementation
- Validation of business rules
- Calls repositories as needed
- Throws custom errors

**Repository Layer**
- Direct database queries via Prisma
- Returns raw data or null
- No business logic

**Example: Creating a Customer**

```typescript
// 1. Frontend (React component)
const handleCreate = async (formData) => {
  const response = await api.post('/customers', formData);
  setCustomers([...customers, response.data.data]);
};

// 2. Frontend → Backend HTTP Request
POST /api/customers
Content-Type: application/json
{
  "businessName": "New Business",
  "contactName": "John",
  "phone": "9999999999"
}

// 3. Express Middleware Chain
middleware.cors()
middleware.authenticate()  ← Verify JWT token
middleware.rbac(['ADMIN', 'SALES'])  ← Check role
middleware.validate(schema)  ← Validate input

// 4. Controller (customers.controller.ts)
export const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    sendSuccess({res, status: 201, data: customer});
  } catch (error) {
    next(error);  // Pass to error middleware
  }
};

// 5. Service (customers.service.ts)
export const createCustomer = async (data) => {
  // Business logic validation
  if (!data.businessName) throw new BadRequestError('Required');
  
  return customerRepository.create(data);
};

// 6. Repository (customers.repository.ts)
export const create = async (data) => {
  return prisma.customer.create({
    data: {
      businessName: data.businessName,
      contactName: data.contactName,
      phone: data.phone,
      status: 'ACTIVE'
    }
  });
};

// 7. Prisma → PostgreSQL
INSERT INTO customers (id, business_name, contact_name, phone, status, created_at, updated_at)
VALUES (uuid, 'New Business', 'John', '9999999999', 'ACTIVE', now(), now());

// 8. Response
{
  "success": true,
  "message": "Customer created",
  "data": {
    "id": "uuid-here",
    "businessName": "New Business",
    "contactName": "John",
    "phone": "9999999999",
    "status": "ACTIVE"
  }
}
```

## Database Schema Architecture

### Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS                                  │
│  PK: id                                                         │
│  Fields: name, email, passwordHash, role, isActive             │
└──────────────────────┬──────────────────────────────────────────┘
                       │ 1:N
          ┌────────────┴────────────┐
          │                         │
    ┌─────▼──────┐          ┌──────▼──────┐
    │ RefreshToken  │        │ Sales        │
    │ PK: id     │          │ PK: id       │
    │ FK: userId │          │ FK: userId   │
    └────────────┘          │ FK: customerId│
                            │ Audit data   │
                            └──────┬───────┘
                                   │ 1:N
                                   │
    ┌──────────────────────────────▼────────────────────────────┐
    │                        CUSTOMERS                           │
    │ PK: id                                                     │
    │ Fields: businessName, contactName, phone, email, etc.    │
    └────────────────────────────────────────────────────────────┘
                            
    ┌─────────────────────────────────────────────────────────────┐
    │                       PRODUCTS                              │
    │ PK: id                                                      │
    │ FK: categoryId → Categories                               │
    │ Fields: sku, name, price, currentStock, minimumStock      │
    └────────────────┬──────────────────────────────────────────┘
                     │ 1:N
         ┌───────────┴───────────┐
         │                       │
    ┌────▼─────┐          ┌─────▼──────┐
    │ SaleItems │          │InventoryMov│
    │ PK: id  │          │ PK: id     │
    │ FK: saleId          │ FK: productId│
    │ FK: productId       │ movementType │
    │ unitPrice (snapshot) │ quantity    │
    │ quantity, total      │ createdById │
    └────────────┘        └────────────┘
```

### Key Design Patterns

1. **Price Snapshot in SaleItems**
   - Stores `unitPrice` at time of sale
   - Historical accuracy maintained if product price changes
   - Prevents data inconsistency

2. **Inventory Audit Trail**
   - Every stock change recorded in `InventoryMovements`
   - Tracks who made the change and when
   - Supports compliance and troubleshooting

3. **Soft Timestamps**
   - `created_at`: Never changes
   - `updated_at`: Updates on every change
   - Enables data history tracking

4. **Role-Based Access**
   - Users have roles (ADMIN, SALES, WAREHOUSE, ACCOUNTS)
   - Middleware checks role before allowing operation
   - Prevents unauthorized access

5. **JWT Token Rotation**
   - Refresh token stored in database with expiry
   - Access token short-lived (15 minutes)
   - Refresh token longer-lived (7 days)
   - On refresh, old token revoked and new one issued

## Authentication & Authorization Flow

### Login Process
```
1. User submits credentials
   ↓
2. Backend hashes password and compares with stored hash
   ↓
3. If valid:
   - Generate JWT access token (15m expiry)
   - Generate refresh token (7d expiry)
   - Store refresh token in DB
   - Return tokens to frontend
   ↓
4. Frontend stores:
   - Access token: localStorage
   - Refresh token: httpOnly cookie

Request Flow (with Auth):
5. Frontend includes: Authorization: Bearer {accessToken}
   ↓
6. Backend verifies token signature and expiry
   ↓
7. If valid: Request proceeds
   If expired: Frontend requests token refresh
   If invalid: Return 401 Unauthorized
```

### RBAC (Role-Based Access Control)

```
┌─────────────────┬──────────────┬────────────┬──────────────┐
│ Role            │ Dashboard    │ Customers  │ Inventory    │
├─────────────────┼──────────────┼────────────┼──────────────┤
│ ADMIN           │ Full Access  │ Full CRUD  │ Full CRUD    │
│ SALES           │ Metrics Only │ Full CRUD  │ Read Only    │
│ WAREHOUSE       │ Limited      │ Read Only  │ Full CRUD    │
│ ACCOUNTS        │ Reports      │ Read Only  │ Read Only    │
└─────────────────┴──────────────┴────────────┴──────────────┘
```

## State Management

### Frontend State Architecture

```
GlobalState (AuthContext)
├── user
│   ├── id
│   ├── name
│   ├── email
│   └── role
├── loading
├── login() - function
└── logout() - function

ComponentState (useState hooks)
├── Page specific state
│   ├── customers (list data)
│   ├── page (pagination)
│   ├── search (search query)
│   └── loading
└── Modal state
    ├── isOpen
    ├── editingId
    └── formData
```

### Backend State Management

```
Request Scope
├── req.user (from JWT middleware)
├── req.query (URL parameters)
└── req.body (POST/PUT data)

Database Scope
├── User sessions (refresh tokens)
└── Audit trail (movements, sales)
```

## Error Handling Architecture

### Error Flow

```
Try Block (Operation)
   ↓
Error Caught
   ↓
Custom Error Class (AppError, NotFoundError, etc.)
   ↓
Error Middleware (catches all errors)
   ↓
Format Error Response
   ↓
Return to Frontend
   ↓
Frontend handles with toast notification
```

### Custom Error Classes
```typescript
AppError (base class)
├── NotFoundError (404)
├── BadRequestError (400)
├── UnauthorizedError (401)
└── ForbiddenError (403)
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "uuid",
    "field": "value"
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "What went wrong",
  "errors": {
    "field": "Error details"
  }
}
```

## Performance Considerations

### Database Optimization
1. **Indexes**: PK, FK, and search fields indexed
2. **Query Optimization**: Select only needed fields
3. **N+1 Prevention**: Use `include` in Prisma
4. **Pagination**: Limit results per page
5. **Connection Pooling**: Managed by Prisma

### API Optimization
1. **Request Validation**: Fail fast with bad input
2. **Caching**: Leverage browser caching (headers)
3. **Compression**: Enable gzip
4. **Rate Limiting**: (Optional, for production)

### Frontend Optimization
1. **Code Splitting**: Lazy load routes
2. **Memoization**: Prevent unnecessary re-renders
3. **Query Caching**: With TanStack Query
4. **Asset Optimization**: Vite bundle optimization

## Security Architecture

### Defense Layers

```
Layer 1: Network
└── HTTPS/SSL (enforced in production)

Layer 2: API Gateway
├── CORS (only allow frontend origin)
├── Rate Limiting (optional)
└── Request Size Limits

Layer 3: Authentication
├── JWT Signature Verification
├── Token Expiry Checking
└── Refresh Token Rotation

Layer 4: Authorization
├── Role Checking (RBAC)
└── Resource Ownership Verification

Layer 5: Input Validation
├── Schema Validation
├── Type Checking
└── Sanitization

Layer 6: Database
├── Parameterized Queries (Prisma)
├── Foreign Key Constraints
└── Transaction Isolation

Layer 7: Data Protection
├── Password Hashing (bcryptjs)
├── Sensitive Data Encryption (if needed)
└── Audit Logging
```

## Deployment Architecture

### Development
```
Local Machine
├── PostgreSQL (localhost:5432)
├── Backend (localhost:5000)
└── Frontend (localhost:5173)
```

### Production
```
Vercel (Frontend)
    ↓ API calls
Render (Backend)
    ↓ Database queries
Supabase PostgreSQL
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API design (can run multiple instances)
- Load balancer distributes requests
- Database connection pooling

### Vertical Scaling
- Upgrade server tier
- Increase database resources
- Cache layer (Redis) for frequently accessed data

### Future Optimizations
- GraphQL API for flexible queries
- Caching layer (Redis)
- Message queue for async operations
- Search engine (Elasticsearch) for complex queries
- CDN for static assets

---

This architecture provides a solid foundation for a production-grade business application with room for growth and optimization.
