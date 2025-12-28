# DawaSpot Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- MongoDB Atlas account (or other MongoDB hosting)
- Vercel account (for web frontend)
- Railway/Render account (for backend)
- Domain name (dawaspot.co.ke)

---

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**: https://cloud.mongodb.com
2. **Create a Cluster** (free tier: M0)
3. **Create Database User** with read/write access
4. **Whitelist IP Address** (or allow all: 0.0.0.0/0 for Railway)
5. **Get Connection String**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/dawaspot?retryWrites=true&w=majority
   ```

---

## 🔧 Backend Deployment (Railway)

### Option A: Railway (Recommended)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Navigate to backend**:
   ```bash
   cd backend
   ```

3. **Initialize Railway project**:
   ```bash
   railway init
   ```

4. **Set Environment Variables** in Railway Dashboard:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
   NODE_ENV=production
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

6. **Note your Railway URL**: `https://dawaspot-backend.railway.app`

### Option B: Render

1. Go to https://render.com
2. Create new **Web Service**
3. Connect your GitHub repo
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

---

## 🌐 Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Navigate to web app**:
   ```bash
   cd web
   ```

3. **Create production environment file** `.env.production`:
   ```
   NEXT_PUBLIC_API_URL=https://dawaspot-backend.railway.app/api
   ```

4. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

5. **Or connect via Vercel Dashboard**:
   - Import Git repository
   - Configure environment variables
   - Deploy

---

## 🔗 Domain Configuration

### For Vercel (Frontend):
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add `dawaspot.co.ke` and `www.dawaspot.co.ke`
3. Update DNS records at your registrar:
   ```
   Type: A     Name: @     Value: 76.76.21.21
   Type: CNAME Name: www   Value: cname.vercel-dns.com
   ```

### For Railway (Backend):
1. Go to Railway Dashboard → Project → Settings → Domains
2. Add `api.dawaspot.co.ke`
3. Add CNAME record:
   ```
   Type: CNAME Name: api   Value: your-project.railway.app
   ```

---

## 🔐 Production Security Checklist

- [ ] Strong JWT_SECRET (32+ random characters)
- [ ] MongoDB user has minimum required permissions
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Environment variables NOT in code
- [ ] Logging configured for production
- [ ] Database backups scheduled
- [ ] Error monitoring (Sentry) configured

---

## 📱 Mobile App Deployment (Expo)

### For Development:
```bash
cd mobile
npx expo start
```

### For Production (App Stores):

1. **Configure app.json** with production settings

2. **Build for iOS**:
   ```bash
   eas build --platform ios
   ```

3. **Build for Android**:
   ```bash
   eas build --platform android
   ```

4. **Submit to stores**:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

---

## 🔄 CI/CD Pipeline

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      - name: Deploy Backend
        run: railway up -d
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📊 Monitoring & Analytics

### Error Monitoring (Sentry):
```bash
npm install @sentry/node @sentry/react
```

### Uptime Monitoring:
- Use UptimeRobot (free tier)
- Monitor: `https://dawaspot.co.ke/api/health`

### Analytics:
- Google Analytics 4
- Or Plausible Analytics (privacy-focused)

---

## 🆘 Troubleshooting

### Common Issues:

1. **MongoDB Connection Fails**:
   - Check IP whitelist
   - Verify connection string
   - Check network access

2. **CORS Errors**:
   - Verify production URLs in server.js
   - Check for trailing slashes

3. **Build Failures**:
   - Check Node.js version
   - Clear node_modules and reinstall

4. **API Not Working**:
   - Check environment variables
   - Verify API URL in frontend

---

## 📞 Support

For deployment issues:
- Email: tech@dawaspot.co.ke
- GitHub Issues: github.com/dawaspot/app/issues
