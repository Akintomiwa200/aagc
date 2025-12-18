# Deployment Guide

Complete guide for deploying AAGC Platform to production.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)
- OAuth credentials (Google/Apple)

## Backend Deployment

### Option 1: PM2 (Recommended for VPS)

1. **Build the application:**
   ```bash
   cd backend
   npm run build
   ```

2. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

3. **Start with PM2:**
   ```bash
   pm2 start dist/main.js --name aagc-backend
   pm2 save
   pm2 startup
   ```

4. **Configure environment:**
   Create `backend/.env` with production values.

5. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3001
   CMD ["node", "dist/main.js"]
   ```

2. **Build and run:**
   ```bash
   docker build -t aagc-backend .
   docker run -d -p 3001:3001 --env-file .env aagc-backend
   ```

### Option 3: Cloud Platforms

#### Heroku
```bash
heroku create aagc-backend
heroku config:set MONGO_URI=your-mongo-uri
git push heroku main
```

#### Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### AWS Elastic Beanstalk
1. Install EB CLI
2. `eb init`
3. `eb create`
4. `eb deploy`

## Frontend Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure environment variables** in Vercel dashboard

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Set environment variables

### Self-Hosted

1. **Build:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start:**
   ```bash
   npm start
   ```

3. **Use PM2:**
   ```bash
   pm2 start npm --name aagc-frontend -- start
   ```

## Mobile Deployment

### PWA Deployment

1. **Build:**
   ```bash
   cd mobile
   npm run build
   ```

2. **Deploy to static hosting:**
   - Vercel
   - Netlify
   - GitHub Pages

### Native App (Optional)

Use Capacitor or Cordova to wrap as native app:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
npx cap sync
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create cluster on MongoDB Atlas
2. Get connection string
3. Whitelist IP addresses
4. Update `MONGO_URI` in environment variables

### Local MongoDB

1. Install MongoDB
2. Create database: `aagc`
3. Set `MONGO_URI=mongodb://localhost:27017/aagc`

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Using Cloudflare

1. Add domain to Cloudflare
2. Enable SSL/TLS
3. Set to "Full" mode

## Environment Variables Checklist

### Backend
- [ ] `MONGO_URI`
- [ ] `JWT_SECRET`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `APPLE_CLIENT_ID` (if using)
- [ ] `FRONTEND_URL`

### Frontend
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_SOCKET_URL`
- [ ] `NEXT_PUBLIC_SITE_URL`

## Monitoring

### Recommended Tools

- **PM2 Monitoring**: `pm2 monit`
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics

## Backup Strategy

1. **Database Backups:**
   - MongoDB Atlas: Automatic backups
   - Local: `mongodump` scheduled via cron

2. **Code Backups:**
   - Git repository
   - Regular commits

## Security Checklist

- [ ] HTTPS enabled
- [ ] Strong JWT secret
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Database credentials secured
- [ ] Rate limiting enabled (future)
- [ ] Input validation on all endpoints
- [ ] Regular dependency updates

## Troubleshooting

### Backend won't start
- Check MongoDB connection
- Verify environment variables
- Check port availability

### Frontend build fails
- Clear `.next` folder
- Reinstall dependencies
- Check Node version

### WebSocket connection fails
- Verify CORS settings
- Check firewall rules
- Ensure WebSocket support in proxy

## Support

For deployment issues, contact: devops@aagc.org

