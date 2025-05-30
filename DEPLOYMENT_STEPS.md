# 🚀 Step-by-Step Deployment Instructions

## Prerequisites
- ✅ Database tested and working
- ✅ Backend and frontend configured for production
- ✅ GitHub repository ready (recommended)

## Step 1: Deploy Backend to Render Web Service 🔧

### 1.1 Create Render Web Service
1. Go to [render.com](https://render.com) and log in
2. Click **"New +"** → **"Web Service"**
3. If using GitHub: Connect your repository and select the Apex-Protocol repo
4. If not using GitHub: Choose **"Deploy from Git URL"** and enter your repo URL

### 1.2 Configure Build Settings
```
Name: apex-protocol-backend
Environment: Node
Region: Frankfurt (or closest to your database)
Branch: main (or your default branch)
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 1.3 Set Environment Variables
In the Environment section, add these variables:
```
DB_CONNECTION_STRING=postgresql://apex_protocol_user:BDlrWHNn6dq7P7dWdgw9Z9d6XfAEe9GO@dpg-d0t0cg49c44c738k3ce0-a.frankfurt-postgres.render.com/apex_protocol
MEMBERSHIP_PASSCODE=APEXPROTOCOL-ELITE77
SESSION_SECRET=qWzyAtFmQmSgp8LM9q1l2l6SHPGSTwYn
ADMIN_PASSCODE=APEXADMIN777
NODE_ENV=production
FRONTEND_URL=https://apex-protocol.netlify.app
```

### 1.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-5 minutes)
3. Note your backend URL: `https://apex-protocol-backend.onrender.com` (or similar)

### 1.5 Test Backend
Once deployed, test these endpoints:
- `GET https://your-backend-url.onrender.com/` - Should return "Hello from Apex Protocol Backend!"
- `GET https://your-backend-url.onrender.com/api/test/health` - Should return health status

---

## Step 2: Deploy Frontend to Netlify 🌐

### 2.1 Prepare Frontend for Deployment
Update the environment variable with your actual backend URL:

In `frontend/.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=https://your-actual-backend-url.onrender.com
```

### 2.2 Create Netlify Site
1. Go to [netlify.com](https://netlify.com) and log in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Select the Apex-Protocol repository

### 2.3 Configure Build Settings
```
Base directory: frontend
Build command: npm run build
Publish directory: out
```

### 2.4 Set Environment Variables
In Site settings → Environment variables, add:
```
NEXT_PUBLIC_BACKEND_URL=https://your-actual-backend-url.onrender.com
NODE_ENV=production
```

### 2.5 Deploy
1. Click **"Deploy site"**
2. Wait for build and deployment (2-5 minutes)
3. Note your frontend URL: `https://wonderful-name-123456.netlify.app`

---

## Step 3: Update CORS Configuration 🔄

### 3.1 Update Backend Environment
1. Go back to your Render dashboard
2. Update the `FRONTEND_URL` environment variable with your actual Netlify URL:
```
FRONTEND_URL=https://your-actual-netlify-url.netlify.app
```
3. Redeploy the backend service

---

## Step 4: End-to-End Testing 🧪

### 4.1 Test User Registration
1. Go to your Netlify frontend URL
2. Click "Sign Up"
3. Register with: `test@example.com` / `password123`
4. Verify registration success

### 4.2 Test Login
1. Login with the account you just created
2. Verify you reach the dashboard

### 4.3 Test Membership Activation
1. Go to "Join Club"
2. Enter membership passcode: `APEXPROTOCOL-ELITE77`
3. Verify membership status changes

### 4.4 Test Admin Access
1. Go to "Admin Access"
2. Enter admin passcode: `APEXADMIN777`
3. Verify admin privileges

### 4.5 Test Message Functionality
1. Go to "New Message"
2. Create a strategic insight message
3. Verify it appears in the dashboard

---

## 🎉 Success Checklist

- [ ] Backend deployed and responding on Render
- [ ] Frontend deployed and loading on Netlify
- [ ] Database connection working in production
- [ ] User registration working
- [ ] Login/logout functioning
- [ ] Membership system operational
- [ ] Admin system working
- [ ] Message CRUD operations functioning
- [ ] CORS properly configured
- [ ] Sessions persisting correctly

---

## 🆘 Troubleshooting

### Backend Issues
- Check Render logs for connection errors
- Verify all environment variables are set
- Test database connectivity from Render console

### Frontend Issues
- Check Netlify build logs
- Verify environment variables
- Test API calls in browser DevTools

### CORS Issues
- Ensure FRONTEND_URL matches exact Netlify URL
- Check for trailing slashes
- Verify protocol (https://)

---

**Ready to deploy? Follow these steps in order!** 🚀
