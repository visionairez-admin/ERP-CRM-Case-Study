# Deployment Guide

Complete step-by-step guide to deploy the ERP + CRM application to production.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                        │
│  - React + Vite application                                │
│  - Serves static files + client-side routing               │
│  - Connects to backend via API                             │
└────────────┬────────────────────────────────────────────────┘
             │ API Requests
             │
┌────────────▼────────────────────────────────────────────────┐
│                  Render (Backend)                           │
│  - Express.js REST API                                     │
│  - Node.js runtime                                         │
│  - Connects to PostgreSQL database                         │
└────────────┬────────────────────────────────────────────────┘
             │ Database Connection
             │
┌────────────▼────────────────────────────────────────────────┐
│              Supabase (PostgreSQL Database)                 │
│  - Managed PostgreSQL instance                             │
│  - Automatic backups                                       │
│  - Connection pooling                                      │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- GitHub account (for code hosting)
- Vercel account (frontend deployment)
- Render account (backend deployment)
- Supabase account (PostgreSQL database)

## Step 1: Prepare Code for Production

### 1.1 Update Backend Configuration

Update `backend/.env.production`:
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/erp_crm_db
JWT_ACCESS_SECRET=generate-a-strong-32-char-secret
JWT_REFRESH_SECRET=generate-a-strong-32-char-secret
COOKIE_SECRET=generate-a-strong-32-char-secret
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=5000
```

**Generate strong secrets:**
```bash
# In Node.js REPL
> require('crypto').randomBytes(32).toString('hex')
```

### 1.2 Update Frontend Configuration

Update `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### 1.3 Add build scripts

Verify `package.json` has build commands:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=backend\" \"npm run dev --workspace=frontend\"",
    "build": "npm run build --workspace=backend && npm run build --workspace=frontend",
    "start": "npm start --workspace=backend"
  }
}
```

## Step 2: Setup Database (Supabase)

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - Organization: Create new
   - Project name: `erp-crm-prod`
   - Database password: Generate strong password
   - Region: Choose closest to you
4. Click "Create new project"

### 2.2 Get Database Connection String

1. Go to project settings → Database
2. Copy the "Connection string" (URI format)
3. Replace `[YOUR-PASSWORD]` with actual password
4. Save this URL - you'll need it for backend deployment

### 2.3 Run Migrations

Once Supabase project is ready and you have the connection string:

```bash
# Locally first to test
DATABASE_URL="your-supabase-connection-string" npm run prisma:migrate -- --name production

# Then seed with demo data (optional for prod)
DATABASE_URL="your-supabase-connection-string" npm run prisma:seed
```

## Step 3: Deploy Backend (Render)

### 3.1 Create GitHub Repository

1. Create new GitHub repository: `erp-crm-case-study`
2. Push code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ERP-CRM system"
   git branch -M main
   git remote add origin https://github.com/yourusername/erp-crm-case-study.git
   git push -u origin main
   ```

### 3.2 Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up and verify email
3. Click "New +" → "Web Service"
4. Connect GitHub account
5. Select `erp-crm-case-study` repository
6. Configure:
   - **Name**: `erp-crm-backend`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build --workspace=backend
     ```
   - **Start Command**: 
     ```bash
     npm start --workspace=backend
     ```
   - **Plan**: `Starter` (free tier available)

### 3.3 Add Environment Variables

In Render dashboard, go to your service → Environment:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@aws-0-xxxxx.pooling.supabase.com:6543/postgres
JWT_ACCESS_SECRET=<generate-strong-32-char-secret>
JWT_REFRESH_SECRET=<generate-strong-32-char-secret>
COOKIE_SECRET=<generate-strong-32-char-secret>
CLIENT_URL=https://your-frontend-url.vercel.app
```

### 3.4 Deploy

Click "Deploy" and wait for build to complete.

**Backend URL**: `https://erp-crm-backend.onrender.com` (example)

## Step 4: Deploy Frontend (Vercel)

### 4.1 Add to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select GitHub integration
4. Choose `erp-crm-case-study` repository
5. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build --workspace=frontend`
   - **Output Directory**: `frontend/dist`

### 4.2 Add Environment Variables

In Vercel project settings → Environment Variables:

```
VITE_API_BASE_URL=https://erp-crm-backend.onrender.com/api
```

### 4.3 Deploy

Click "Deploy" and wait for completion.

**Frontend URL**: `https://erp-crm-case-study.vercel.app` (example)

## Step 5: Update Cross-References

After getting both URLs:

1. **Update backend environment** on Render:
   - `CLIENT_URL` → Your Vercel frontend URL
   - Redeploy

2. **Test API connectivity**:
   ```bash
   curl https://your-backend.onrender.com/api/auth/me
   # Should return 401 with "Authentication token missing"
   ```

3. **Test frontend login**:
   - Go to your Vercel URL
   - Try login with: `admin@wholesale.com` / `password123`

## Step 6: Production Checklist

- [ ] Database connection verified on Render
- [ ] Frontend API requests routing to backend
- [ ] Login working correctly
- [ ] All CRUD operations tested
- [ ] Error handling displaying properly
- [ ] No console errors in production
- [ ] CORS working correctly
- [ ] JWT tokens refreshing on 401
- [ ] All pages loading and rendering
- [ ] Responsive design working on mobile

## Monitoring & Maintenance

### Logs

**Backend (Render)**:
- Go to service → Logs
- Real-time logs of API requests and errors
- Search and filter capabilities

**Frontend (Vercel)**:
- Go to project → Deployments → Analytics
- Monitor performance metrics

### Database Backups

Supabase automatically backs up your database:
- Daily automatic backups for 7 days
- Manual backups available anytime
- Point-in-time recovery supported

### Scaling

If traffic increases:

**Vercel**: Automatically scales frontend  
**Render**: Upgrade from Starter to Pro plan  
**Supabase**: Upgrade database tier

## Troubleshooting

### "Can't connect to database"
- Verify DATABASE_URL in environment variables
- Check Supabase project is running
- Verify IP allowlist settings (allow all for Render)

### "CORS errors"
- Verify `CLIENT_URL` matches exact Vercel deployment URL
- Check backend CORS configuration
- Hard refresh frontend browser cache

### "Login not working"
- Verify DATABASE_URL has correct password
- Check JWT secrets are set in environment
- Verify JWT secrets are consistent (don't regenerate)

### "Tokens not refreshing"
- Check refresh token cookie is being set
- Verify httpOnly cookie config in backend
- Check CORS credentials setting

### "Build failing"
- Check build logs in Render/Vercel
- Verify all environment variables are set
- Test build locally first
- Check for TypeScript errors

## Rollback

If something goes wrong:

**Vercel**: Click deployment → Redeploy or select previous deployment  
**Render**: Click service → Auto-Deploy (if enabled) or manual redeploy  
**Supabase**: Use point-in-time recovery if needed

## Cost Estimation

### Free Tier
- **Vercel**: 100GB bandwidth/month
- **Render**: 750 free dyno hours/month
- **Supabase**: 500MB database storage, limited connections

### Estimated Monthly Costs (Production)
- **Vercel Pro**: ~$20/month
- **Render Pro**: ~$12/month
- **Supabase Pro**: ~$25/month
- **Total**: ~$57/month

## Performance Optimization

### Frontend
- Vercel CDN automatically optimizes distribution
- Enable "Web Analytics" for performance insights
- Use `npm run build` to check bundle size

### Backend  
- Monitor Render logs for slow queries
- Consider adding caching layer (Redis)
- Optimize database queries with Prisma

### Database
- Supabase includes connection pooling
- Monitor query performance in dashboard
- Add indexes for frequently searched fields

## Security in Production

1. **Secrets Management**
   - ✅ Never commit `.env` files
   - ✅ Use environment variable management
   - ✅ Regenerate secrets periodically

2. **API Security**
   - ✅ HTTPS enforced by Vercel/Render
   - ✅ CORS properly configured
   - ✅ JWT tokens with expiry

3. **Database Security**
   - ✅ Strong database password
   - ✅ Network restrictions (if needed)
   - ✅ Regular backups
   - ✅ SSL connections enforced

4. **Frontend Security**
   - ✅ No sensitive data in localStorage
   - ✅ httpOnly cookies for tokens
   - ✅ HTTPS-only connections

## Next Steps

After deployment:

1. **Share with others**: Everyone can now access your application
2. **Gather feedback**: Test with different users across roles
3. **Monitor performance**: Watch logs and metrics
4. **Plan improvements**: Add features based on feedback
5. **Document learnings**: Write about your implementation

## Support

For platform-specific support:

- **Vercel**: https://vercel.com/support
- **Render**: https://render.com/docs
- **Supabase**: https://supabase.com/docs

---

**Your application is now live in production!** 🚀
