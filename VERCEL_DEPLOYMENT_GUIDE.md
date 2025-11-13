# 🚀 Vercel Deployment Guide - Quick Start

## ✅ Code is Ready for Deployment!

I've configured your app to use environment variables. Here's how to deploy:

---

## 📝 Step 1: Create .env Files (IMPORTANT!)

### Create `.env.example` in project root:

**Location:** `client/my-app/.env.example`

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
```

### Create `.env` in project root:

**Location:** `client/my-app/.env`

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
```

**How to create:**
1. Right-click in VS Code file explorer
2. New File → `.env`
3. Copy content above
4. Save

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. **Click:** "Add New" → "Project"
4. **Import** your repository: `redshaaro/trello-clone-client`
5. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: `client/my-app` (if monorepo) or leave as `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Environment Variables:**
   - Click "Add Environment Variable"
   - Name: `VITE_API_URL`
   - Value: Your backend URL (see examples below)
   - Select: **All environments** (Production, Preview, Development)

7. **Click:** "Deploy"

8. **Wait** ~2 minutes for build to complete

9. **Done!** Your app is live! 🎉

---

### Option B: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (run from project root)
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# What's your project's name? trello-clone
# In which directory is your code located? ./
# 
# Auto-detected settings:
# Framework Preset: Vite
# Build Command: npm run build
# Output Directory: dist

# Add environment variable
vercel env add VITE_API_URL production
# When prompted, enter your backend URL

# Deploy to production
vercel --prod
```

---

## 🌐 Backend URL Examples

### If Backend on Railway:
```env
VITE_API_URL=https://trello-backend-production.up.railway.app/api
```

### If Backend on Render:
```env
VITE_API_URL=https://trello-backend.onrender.com/api
```

### If Backend on Heroku:
```env
VITE_API_URL=https://trello-backend-app.herokuapp.com/api
```

### If Backend on Custom Domain:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

**⚠️ Important:** Make sure to include `/api` at the end!

---

## 🔧 Update Backend CORS

After deploying to Vercel, you'll get a URL like:
```
https://trello-clone-xxx.vercel.app
```

**Update your backend CORS configuration:**

```javascript
// Backend: server/index.js or app.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',                    // Local development
    'https://trello-clone-xxx.vercel.app',     // Your Vercel URL
  ],
  credentials: true
}));
```

**Or use environment variable in backend:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

## 🧪 Testing After Deployment

### 1. Open Your Vercel URL

### 2. Check Console (F12):
```javascript
// Should NOT see localhost
// Should connect to your production backend
```

### 3. Test These Features:
- [ ] Login/Register
- [ ] Create board
- [ ] Create column
- [ ] Create task
- [ ] Invite member
- [ ] All features working

### 4. If Issues:

**CORS Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```
→ Update backend CORS to include Vercel URL

**404 Errors:**
```
GET https://your-backend/api/boards 404
```
→ Check `VITE_API_URL` is correct

**Still Using Localhost:**
```
GET http://localhost:3000/api/boards
```
→ Env variable not set in Vercel
→ Go to Settings → Environment Variables → Add VITE_API_URL

---

## 📋 Complete Deployment Checklist

### Pre-Deployment:
- [x] Code pushed to GitHub ✅
- [x] Environment variables configured ✅
- [x] .gitignore updated ✅
- [ ] Create .env.example file
- [ ] Create .env file
- [ ] Test locally

### Vercel Setup:
- [ ] Sign up/login to Vercel
- [ ] Import GitHub repository
- [ ] Set framework to Vite
- [ ] Add VITE_API_URL environment variable
- [ ] Deploy

### Backend Setup:
- [ ] Deploy backend first (Railway/Render/Heroku)
- [ ] Get backend URL
- [ ] Update VITE_API_URL in Vercel
- [ ] Update backend CORS with Vercel URL

### Post-Deployment:
- [ ] Test all features
- [ ] Check for CORS errors
- [ ] Verify API calls work
- [ ] Take screenshots
- [ ] Add live demo link to README
- [ ] Add to portfolio

---

## 🎯 Environment Variables Summary

| Variable | Development | Production |
|----------|-------------|------------|
| VITE_API_URL | http://localhost:3000/api | https://your-backend.com/api |

**That's it! Just one variable to configure!**

---

## 📝 Quick Steps (TL;DR)

1. **Create `.env` and `.env.example` files** (see above)
2. **Go to vercel.com**
3. **Import your GitHub repo**
4. **Add env var:** `VITE_API_URL` = your backend URL
5. **Deploy**
6. **Update backend CORS** with Vercel URL
7. **Test and enjoy!** 🎉

---

## 🆘 Need Help?

### Vercel Not Detecting Vite?
- Manually set Framework Preset to "Vite"
- Build Command: `npm run build`
- Output Directory: `dist`

### Environment Variable Not Applied?
- Check it's added to "Production" environment
- Redeploy after adding variables
- Check spelling: `VITE_API_URL` (exact case)

### Build Fails?
- Check build logs in Vercel
- Might need to install dependencies
- Check for linting errors

---

**Create the .env files and you're ready to deploy!** 🚀

**Your code is already configured to use them automatically!**

