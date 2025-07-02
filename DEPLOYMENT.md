# Deployment Guide

This guide will help you deploy your barbershop appointment system using the hybrid approach (frontend on Vercel, backend on Railway).

## Prerequisites

1. **GitHub account** - Your code should be pushed to GitHub
2. **Vercel account** - Sign up at [vercel.com](https://vercel.com)
3. **Railway account** - Sign up at [railway.app](https://railway.app)
4. **Firebase project** - Already configured

## Step 1: Prepare Environment Variables

### Backend Environment Variables (.env)

Create a `.env` file in the `backend` directory:

```env
# Firebase Project Configuration
FIREBASE_PROJECT_ID=sanohaircut
FIREBASE_STORAGE_BUCKET=sanohaircut.appspot.com

# Firebase Admin SDK Key (Base64 encoded)
# To get this: 
# 1. Take your firebase-admin.json content
# 2. Stringify it: JSON.stringify(yourFirebaseAdminJson)
# 3. Base64 encode it: btoa(stringifiedJson)
FIREBASE_ADMIN_KEY_BASE64=your-base64-encoded-firebase-admin-json

# Port (Railway will set this automatically)
PORT=5000
```

### Frontend Environment Variables (.env)

Create a `.env` file in the `frontend` directory:

```env
# API Base URL - will be updated after backend deployment
VITE_API_BASE_URL=http://localhost:5000

# Firebase Configuration (these are already in firebase.js but can be moved here)
VITE_FIREBASE_API_KEY=AIzaSyBJOSfZ7n1PLPZ2G3tG5t3YQZr8XNM4w9E
VITE_FIREBASE_AUTH_DOMAIN=sanohaircut.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sanohaircut
VITE_FIREBASE_STORAGE_BUCKET=sanohaircut.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=622194661744
VITE_FIREBASE_APP_ID=1:622194661744:web:5046e6ed5c65126da917b5
VITE_FIREBASE_MEASUREMENT_ID=G-1VVDEC2FN8
```

## Step 2: Deploy Backend to Vercel (Serverless Functions)

You can deploy your backend to Vercel as serverless functions. This requires some restructuring but keeps everything in one place.

### Option A: Restructure for Vercel Serverless

1. **Create API routes structure:**
   Create a `backend/api` directory and move your routes:
   ```
   backend/
   ├── api/
   │   ├── appointments.js    # Move from routes/appointments.js
   │   ├── times.js          # Move from routes/times.js
   │   └── user.js           # Move from routes/user.js
   ├── firebase-admin.json
   └── package.json
   ```

2. **Convert routes to Vercel functions:**
   Each file in `backend/api/` becomes a serverless function endpoint.

3. **Add vercel.json configuration:**
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "backend/api/**/*.js", "use": "@vercel/node" },
       { "src": "frontend/package.json", "use": "@vercel/static-build" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "/backend/api/$1" },
       { "src": "/(.*)", "dest": "/frontend/$1" }
     ]
   }
   ```

### Option B: Deploy Backend to Railway (Easier)

If you prefer to keep your current Express structure (recommended for simplicity):

1. **Push your code to GitHub** (if not already done)

2. **Go to Railway** ([railway.app](https://railway.app))

3. **Create new project:**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your `sano` repository

4. **Configure the service:**
   - Railway will detect it's a Node.js project
   - Set the **Root Directory** to `backend`
   - The start command should be: `npm start`

5. **Add environment variables:**
   - Go to your service settings
   - Add all the environment variables from your backend `.env` file
   - **Important:** For `FIREBASE_ADMIN_KEY_BASE64`, you need to:
     ```javascript
     // In a browser console or Node.js:
     const firebaseAdmin = require('./firebase-admin.json'); // your actual file content
     const base64Key = Buffer.from(JSON.stringify(firebaseAdmin)).toString('base64');
     console.log(base64Key); // Copy this value
     ```

6. **Deploy:**
   - Railway will automatically deploy
   - Note your backend URL (something like: `https://your-app-name.railway.app`)

## Step 3: Deploy Frontend to Vercel

1. **Update Frontend Environment:**
   - Update your frontend `.env` file:
   ```env
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   ```

2. **Go to Vercel** ([vercel.com](https://vercel.com))

3. **Import your project:**
   - Click "New Project"
   - Import from GitHub
   - Select your `sano` repository

4. **Configure build settings (CRITICAL STEP):**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` ⚠️ **MUST be "frontend"**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
   - **Node.js Version:** 18.x or 20.x

5. **Add environment variables:**
   - In project settings, add all your frontend environment variables
   - Make sure `VITE_API_BASE_URL` points to your Railway backend URL

6. **Deploy:**
   - Vercel will automatically build and deploy
   - You'll get a URL like: `https://your-app.vercel.app`

## Step 4: Test Your Deployment

1. **Visit your Vercel URL**
2. **Test user registration/login**
3. **Test appointment booking**
4. **Test admin functions** (if you have admin users)

## Step 5: Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to your project settings in Vercel
2. Add your custom domain
3. Configure DNS as instructed

### For Railway (Backend):
1. Go to your service settings
2. Add custom domain
3. Update your frontend `VITE_API_BASE_URL` to use the custom domain

## Troubleshooting

### Common Issues:

**General:**
1. **CORS errors:** Make sure your backend allows your frontend domain
2. **Environment variables:** Double-check all environment variables are set correctly
3. **Firebase Admin SDK:** Ensure the base64 encoded key is correct
4. **API calls failing:** Check that frontend is using the correct backend URL

**Vercel Serverless Functions:**
5. **Function timeout:** Vercel has a 10-second timeout for hobby plans
6. **Cold starts:** First request might be slower due to serverless cold starts
7. **File size limits:** Each function has a 50MB limit
8. **Import errors:** Use dynamic imports for large dependencies

**Railway:**
9. **Build failures:** Check that your `package.json` scripts are correct
10. **Memory issues:** Free tier has limited memory (512MB)

## ⚠️ TROUBLESHOOTING: 404 Error on Vercel

If you're seeing a `404: NOT_FOUND` error on your Vercel deployment, here's how to fix it:

### Problem: Vercel Can't Find Your Frontend Files

**Most Common Causes:**
1. Wrong root directory setting
2. Build failed silently
3. Output directory misconfigured

### Solution Steps:

#### Step 1: Check Your Vercel Project Settings

1. **Go to your Vercel dashboard**
2. **Click on your project** (`sano` or similar)
3. **Go to Settings → General**
4. **Check these settings:**

   ```
   Framework Preset: Vite
   Root Directory: frontend  ← CRITICAL: Must be "frontend"
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node.js Version: 18.x (or latest)
   ```

#### Step 2: If Settings Are Wrong, Fix Them

1. **In Vercel Dashboard:**
   - Go to Settings → General
   - Scroll to "Build & Output Settings"
   - **Root Directory:** Change to `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - Click "Save"

2. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - OR push a new commit to trigger auto-deployment

#### Step 3: Check Build Logs

1. **In Vercel Dashboard:**
   - Go to Deployments
   - Click on the failed deployment
   - Check the build logs for errors

**Common Build Log Errors:**
- `npm install` failing → Check package.json
- Build command not found → Check root directory setting
- Vite build failing → Check for syntax errors in your code

#### Step 4: Quick Fix - Deploy with Correct Settings

If you need to start fresh:

1. **Delete the current deployment** (optional)
2. **Import project again** with correct settings:
   - Framework: **Vite**
   - Root Directory: **frontend**
   - Build Command: **npm run build**
   - Output Directory: **dist**

### Alternative: Manual Verification

Test your build locally to ensure it works:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the project
npm run build

# Check if dist folder was created
ls -la dist/

# Test the build locally
npm run preview
```

If the local build works, the issue is definitely in your Vercel configuration.

## Security Notes

- Never commit `.env` files
- Keep your Firebase Admin SDK key secure
- Use environment variables for all sensitive data
- Consider setting up proper CORS policies for production

## Automatic Deployments

Both Vercel and Railway support automatic deployments:
- **Vercel:** Deploys automatically on every push to your main branch
- **Railway:** Also deploys automatically on every push

You can configure which branches trigger deployments in each platform's settings.

## Alternative: Deploy Everything to Vercel (Full-Stack)

You can deploy both frontend and backend to Vercel. Here are two approaches:

### Approach 1: All-Vercel with Serverless Functions (Requires Restructuring)

**Time Required:** 2-3 hours (restructuring needed)  
**Difficulty:** Medium  
**Benefits:** Single platform, automatic deployments, great performance  

#### Steps:

1. **Create Vercel configuration:**
   Create `vercel.json` in your root directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "frontend/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/api/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/frontend/dist/$1"
       }
     ],
     "buildCommand": "cd frontend && npm run build",
     "outputDirectory": "frontend/dist",
     "installCommand": "cd frontend && npm install && cd ../backend && npm install"
   }
   ```

2. **Restructure backend as API routes:**
   Create `api/` folder in your root directory:
   ```
   api/
   ├── appointments.js
   ├── times.js
   ├── user.js
   └── _utils/
       └── firebase.js
   ```

3. **Convert your Express routes to Vercel functions:**
   Example for `api/appointments.js`:
   ```javascript
   import admin from 'firebase-admin';
   
   // Initialize Firebase (same as your current setup)
   if (!admin.apps.length) {
     // Your Firebase initialization code
   }
   
   export default async function handler(req, res) {
     // Your route logic here
     if (req.method === 'GET') {
       // Handle GET /api/appointments
     } else if (req.method === 'POST') {
       // Handle POST /api/appointments
     }
     // etc.
   }
   ```

4. **Deploy to Vercel:**
   - Connect your GitHub repo to Vercel
   - Vercel will automatically detect the configuration
   - Add your environment variables in Vercel dashboard

### Approach 2: Hybrid (Recommended for Beginners)

**Time Required:** 30 minutes - 1 hour  
**Difficulty:** Easy  
**Benefits:** No code restructuring needed  

#### Steps:

1. **Deploy backend to Railway** (as shown above)
2. **Deploy frontend to Vercel** (as shown above)
3. **Connect them via environment variables**

### Which Approach Should You Choose?

| Factor | All-Vercel | Hybrid (Railway + Vercel) |
|--------|------------|---------------------------|
| **Setup Time** | 2-3 hours | 30-60 minutes |
| **Code Changes** | Significant restructuring | Minimal (already done) |
| **Performance** | Excellent (serverless) | Excellent |
| **Cost** | Free tier very generous | Free tiers on both |
| **Maintenance** | Single platform | Two platforms |
| **Learning Curve** | Medium-High | Low |

**Recommendation:** Start with the **Hybrid approach** (Railway + Vercel) since I've already prepared your code for it. You can always migrate to all-Vercel later if you want to consolidate platforms.
