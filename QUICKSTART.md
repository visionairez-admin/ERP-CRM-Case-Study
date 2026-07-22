# Quick Start Guide

Fast setup and common tasks for developing the ERP-CRM system.

## 5-Minute Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL running locally
- Git installed

### Installation

```bash
# 1. Clone or navigate to project
cd erp-crm-case-study

# 2. Install all dependencies
npm install

# 3. Setup database
cd backend
npm run prisma:migrate
npm run prisma:seed
cd ..

# 4. Start both servers
npm run dev
```

**Done!** 
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Login Credentials

```
Email: admin@wholesale.com
Password: password123
```

Other users:
- `sales@wholesale.com`
- `warehouse@wholesale.com`
- `accounts@wholesale.com`

(All passwords: `password123`)

## Common Commands

### Development
```bash
npm run dev              # Start both frontend and backend
npm run dev:backend     # Backend only
npm run dev:frontend    # Frontend only
```

### Building
```bash
npm run build           # Build for production
npm run build --workspace=backend
npm run build --workspace=frontend
```

### Database
```bash
npm run prisma:migrate  # Run pending migrations
npm run prisma:seed     # Seed with demo data
npm run prisma:studio   # Open Prisma Studio (visual DB browser)
npm run prisma:reset    # Reset database completely
```

## Project Structure

```
backend/
  ├── src/
  │   ├── modules/          # Feature modules (auth, customers, products, etc.)
  │   ├── middlewares/      # Express middlewares (auth, validation, errors)
  │   ├── validators/       # Validation schemas
  │   ├── utils/            # Helper functions
  │   ├── app.ts            # Express app setup
  │   └── server.ts         # Server entry point
  └── prisma/
      ├── schema.prisma     # Database schema
      └── seed.ts           # Seed script

frontend/
  ├── src/
  │   ├── components/       # React components
  │   ├── pages/            # Page components
  │   ├── context/          # React context (Auth)
  │   ├── hooks/            # Custom hooks
  │   ├── services/         # API client
  │   └── App.tsx           # Root component
  └── vite.config.ts        # Vite configuration
```

## Adding a New Feature

### Example: Adding a new module (Reports)

#### 1. Backend

**Create folder structure:**
```bash
mkdir backend/src/modules/reports
touch backend/src/modules/reports/{routes,controller,service,repository}.ts
```

**Create repository** (`backend/src/modules/reports/repository.ts`):
```typescript
import { prisma } from '../../config/prisma';

export const getSalesReport = async (fromDate: Date, toDate: Date) => {
  return prisma.sale.findMany({
    where: {
      createdAt: { gte: fromDate, lte: toDate }
    },
    include: { items: true, customer: true }
  });
};
```

**Create service** (`backend/src/modules/reports/service.ts`):
```typescript
import * as reportRepository from './repository';

export const generateSalesReport = async (fromDate: Date, toDate: Date) => {
  const sales = await reportRepository.getSalesReport(fromDate, toDate);
  // Add business logic here
  return sales;
};
```

**Create controller** (`backend/src/modules/reports/controller.ts`):
```typescript
import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response';
import * as reportService from './service';

export const getSalesReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fromDate, toDate } = req.query;
    const report = await reportService.generateSalesReport(
      new Date(fromDate as string),
      new Date(toDate as string)
    );
    sendSuccess({ res, data: report });
  } catch (error) {
    next(error);
  }
};
```

**Create routes** (`backend/src/modules/reports/routes.ts`):
```typescript
import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import * as reportController from './controller';

const router = Router();

router.get('/sales', authenticate, authorize(['ADMIN', 'ACCOUNTS']), reportController.getSalesReport);

export default router;
```

**Add to main app** (`backend/src/app.ts`):
```typescript
import reportsRoutes from './modules/reports/routes';
// ...
app.use('/api/reports', reportsRoutes);
```

#### 2. Frontend

**Create page** (`frontend/src/pages/Reports.tsx`):
```typescript
import React, { useState } from 'react';
import api from '../services/api';
import { Card, CardTitle } from '../components/ui/Card';

export const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/sales', {
        params: { fromDate: startDate, toDate: endDate }
      });
      setReport(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardTitle>Sales Report</CardTitle>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <button onClick={handleGenerateReport}>Generate Report</button>
      {report && <pre>{JSON.stringify(report, null, 2)}</pre>}
    </Card>
  );
};
```

**Add route** (`frontend/src/App.tsx`):
```typescript
import { Reports } from './pages/Reports';

<Route path="/reports" element={<Reports />} />
```

## API Endpoints Quick Reference

### Authentication
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Current user

### Customers
- `GET /customers` - List
- `POST /customers` - Create
- `GET /customers/:id` - Get one
- `PUT /customers/:id` - Update
- `DELETE /customers/:id` - Delete

### Products
- `GET /products` - List
- `POST /products` - Create
- `GET /products/:id` - Get one
- `PUT /products/:id` - Update
- `DELETE /products/:id` - Delete

### Sales
- `GET /sales` - List
- `POST /sales` - Create
- `GET /sales/:id` - Get one

### Inventory
- `GET /inventory/movements` - List movements
- `POST /inventory/movements` - Record movement

### Analytics
- `GET /analytics/dashboard` - Dashboard metrics

## Testing an Endpoint with curl

```bash
# Login first
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wholesale.com","password":"password123"}'

# Copy the accessToken from response, then use it:
TOKEN="your-access-token-here"

# Get customers
curl -X GET http://localhost:5000/api/customers \
  -H "Authorization: Bearer $TOKEN"

# Create customer
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "businessName":"New Business",
    "contactName":"John Doe",
    "phone":"9999999999",
    "status":"ACTIVE"
  }'
```

## Debugging

### Frontend
1. Open DevTools (F12)
2. Check Console for errors
3. Network tab to inspect API calls
4. React Developer Tools extension for component inspection

### Backend
```bash
# Logs are printed to console during development
# Add console.logs to debug:
console.log('Debug info:', variable);

# Check network requests with curl
curl http://localhost:5000/api/endpoint

# Use Prisma Studio to inspect database
npm run prisma:studio
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/erp_crm_db
JWT_ACCESS_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-secret-here
COOKIE_SECRET=your-secret-here
CLIENT_URL=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Common Issues & Solutions

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
psql -U postgres

# Create database if not exists
createdb erp_crm_db

# Check connection in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/erp_crm_db"
```

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
```

### "Port already in use"
```bash
# Backend port 5000 already in use
# Change PORT in .env or kill process using port:
lsof -i :5000
kill -9 <PID>

# Frontend port 5173
npx vite preview --port 5174
```

### "CORS error in browser"
- Check `CLIENT_URL` in backend .env matches frontend URL
- Verify CORS middleware is enabled in `src/app.ts`

## Performance Tips

1. **Database queries**: Use Prisma `select` to fetch only needed fields
2. **Frontend rendering**: Use React.memo for expensive components
3. **API calls**: Cache with TanStack Query
4. **Pagination**: Always use limit and offset
5. **Indexes**: Database has indexes on common query fields

## Code Style

### TypeScript
- Use explicit types, avoid `any`
- Use interfaces for complex objects
- Use enums for fixed values

### File Organization
- One component per file
- Group related files in folders
- Keep files under 300 lines

### Naming
- Components: PascalCase (Dashboard.tsx)
- Functions/variables: camelCase (getCustomers)
- Constants: UPPER_SNAKE_CASE (DB_URL)

## Resources

- Express.js: https://expressjs.com
- Prisma: https://www.prisma.io/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- TypeScript: https://www.typescriptlang.org

## Need Help?

1. Check existing code for examples
2. Read function documentation in JSDoc comments
3. Review error messages carefully
4. Check browser DevTools Network tab
5. Look at backend logs in terminal

---

**Happy coding!** 🚀
