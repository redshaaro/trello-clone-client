# 🔧 Environment Variables Setup for Deployment

## ⚠️ Important: Create .env Files Manually

I cannot create `.env` files directly, but here's what you need to do:

---

## 📝 Step 1: Create .env.example

Create a file named `.env.example` in the root of your project:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# For production, set this to your deployed backend URL:
# VITE_API_URL=https://your-backend.herokuapp.com/api
# VITE_API_URL=https://your-backend.railway.app/api
# VITE_API_URL=https://your-backend.render.com/api
```

---

## 📝 Step 2: Create .env (For Local Development)

Create a file named `.env` in the root of your project:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
```

**Note:** This file is already in `.gitignore` and won't be pushed to GitHub.

---

## 🚀 Step 3: Vercel Deployment Setup

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel:** https://vercel.com
2. **Import your GitHub repository**
3. **Configure Project:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   - Go to: Settings → Environment Variables
   - Add variable:
     - **Name:** `VITE_API_URL`
     - **Value:** `https://your-backend-url.com/api`
   - Click "Add"

5. **Deploy!**

---

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# When prompted, add environment variables:
# VITE_API_URL = https://your-backend-url.com/api

# Deploy to production
vercel --prod
```

---

## 🔒 Important Notes

### ✅ What's Already Done:

I've updated your code to use environment variables:

**File:** `src/lib/axios.js`
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

**File:** `src/services/RegisterationService.js`
```javascript
// Changed from hardcoded URLs:
// ❌ await publicAxios.post("http://localhost:3000/api/auth/register", ...)

// To relative URLs:
// ✅ await publicAxios.post("/auth/register", ...)
```

---

### ⚠️ What You Need to Do:

1. **Create `.env.example`** manually (copy content above)
2. **Create `.env`** manually (copy content above)
3. **Set VITE_API_URL in Vercel** to your backend URL

---

## 🌐 Environment Variable Values

### Local Development:
```env
VITE_API_URL=http://localhost:3000/api
```

### Production (Vercel):
Choose based on where you deploy your backend:

**Heroku:**
```env
VITE_API_URL=https://your-app-name.herokuapp.com/api
```

**Railway:**
```env
VITE_API_URL=https://your-app-name.up.railway.app/api
```

**Render:**
```env
VITE_API_URL=https://your-app-name.onrender.com/api
```

**DigitalOcean:**
```env
VITE_API_URL=https://your-domain.com/api
```

---

## ✅ .gitignore Already Updated

I've updated `.gitignore` to exclude:
```
.env
.env.local
.env.production
```

This means `.env` files won't be pushed to GitHub (security best practice).

---

## 🧪 How to Test Locally

### After Creating .env:

1. **Stop your dev server** (if running)
2. **Restart dev server:**
   ```bash
   npm run dev
   ```
3. **Check console** - Should connect to `http://localhost:3000/api`
4. **Test features** - Should work normally

---

## 🚀 Vercel Deployment Steps

### 1. Push to GitHub (Already Done ✅)

### 2. Deploy to Vercel

```bash
# Quick deploy
vercel --prod

# Or use dashboard at vercel.com
```

### 3. Add Environment Variable in Vercel

**Via Dashboard:**
1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.com/api`
   - **Environments:** Production, Preview, Development (check all)
4. Save
5. Redeploy if needed

**Via CLI:**
```bash
vercel env add VITE_API_URL
# When prompted, enter: https://your-backend-url.com/api
# Select: Production
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: CORS Errors After Deployment

**Symptom:** Frontend can't connect to backend

**Fix:** Update backend CORS configuration:
```javascript
// Backend: server/index.js or app.js
app.use(cors({
  origin: [
    'http://localhost:5173',           // Local development
    'https://your-app.vercel.app',     // Production frontend
  ],
  credentials: true
}));
```

---

### Issue 2: API Calls Return 404

**Symptom:** All API calls fail

**Cause:** Wrong API URL

**Fix:** 
- Check `VITE_API_URL` in Vercel settings
- Ensure it ends with `/api`
- Make sure backend is running
- Test backend URL directly in browser

---

### Issue 3: Environment Variable Not Working

**Symptom:** Still using localhost in production

**Cause:** Need to rebuild after adding env vars

**Fix:**
```bash
# In Vercel dashboard:
# Deployments → ... → Redeploy
```

---

## 📋 Quick Checklist

### Before Deploying:

- [ ] Create `.env.example` file (copy content above)
- [ ] Create `.env` file (copy content above)
- [ ] Test locally with `npm run dev`
- [ ] Commit changes (if you created .env.example)
- [ ] Push to GitHub

### During Vercel Deployment:

- [ ] Connect GitHub repository
- [ ] Set Framework to "Vite"
- [ ] Add environment variable: `VITE_API_URL`
- [ ] Set value to your backend URL
- [ ] Deploy

### After Deployment:

- [ ] Test login/register
- [ ] Test creating boards
- [ ] Check browser console for errors
- [ ] If CORS error → Update backend CORS config
- [ ] If 404 error → Check API_URL value

---

## 🎯 Example Configuration

### Your Setup Should Look Like:

**Local (.env):**
```env
VITE_API_URL=http://localhost:3000/api
```

**Vercel (Environment Variables):**
```
VITE_API_URL = https://trello-clone-api.railway.app/api
```

**Backend CORS:**
```javascript
origin: [
  'http://localhost:5173',
  'https://your-trello-clone.vercel.app'
]
```

---

## 🔍 How to Verify It's Working

### Check axios.js:
```javascript
// Should use environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

### Test in Browser Console:
```javascript
// After deployment, check:
console.log(import.meta.env.VITE_API_URL)
// Should show your production backend URL
```

---

## 📝 Files to Create Manually

### 1. .env.example (commit this to Git)
```bash
# In project root: client/my-app/.env.example
VITE_API_URL=http://localhost:3000/api
```

### 2. .env (don't commit - already in .gitignore)
```bash
# In project root: client/my-app/.env
VITE_API_URL=http://localhost:3000/api
```

---

## 🎉 Summary

**What I've Done:**
- ✅ Updated `axios.js` to use environment variables
- ✅ Fixed `RegisterationService.js` to use relative URLs
- ✅ Created `.gitignore` to exclude .env files
- ✅ Provided complete setup instructions

**What You Need to Do:**
1. Create `.env.example` file (copy content from above)
2. Create `.env` file (copy content from above)
3. When deploying to Vercel, set `VITE_API_URL` to your backend URL
4. Update backend CORS to allow your Vercel domain

**Result:**
- ✅ Works locally with localhost
- ✅ Works in production with deployed backend
- ✅ No hardcoded URLs
- ✅ Easy to configure

---

**Create the .env files now, then you're ready to deploy!** 🚀

