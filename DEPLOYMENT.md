# 🚀 Apex Protocol Deployment Guide

## ✅ Completed Preparations

### 1. Database Setup (✓ COMPLETE)
- ✅ PostgreSQL database created on Render
- ✅ Database URL: `postgresql://apex_protocol_user:BDlrWHNn6dq7P7dWdgw9Z9d6XfAEe9GO@dpg-d0t0cg49c44c738k3ce0-a.frankfurt-postgres.render.com/apex_protocol`
- ✅ Schema created (users and messages tables)
- ✅ Database seeded with test users and messages
- ✅ **Database connection tested and working perfectly!**

### 2. Backend Configuration (✓ COMPLETE)
- ✅ `server.js` configured for production
- ✅ CORS settings updated for production
- ✅ Environment variables configured
- ✅ Database connection refactored to use connection string
- ✅ SSL configuration for production database
- ✅ **Connection test passed - ready for deployment!**

### 3. Frontend Configuration (✓ COMPLETE)
- ✅ Next.js configured for static export
- ✅ API rewrites configured for development/production
- ✅ Environment variables set up
- ✅ Netlify configuration file created

## 🔄 Next Steps: Deployment Process

### Step 1: Deploy Backend to Render Web Service
1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure build and start commands
4. Set environment variables
5. Deploy and test

### Step 2: Deploy Frontend to Netlify
1. Create new site on Netlify
2. Connect GitHub repository  
3. Configure build settings
4. Set environment variables
5. Deploy and test

### Step 3: Configure Production CORS
1. Update backend environment with actual Netlify URL
2. Test cross-origin requests
3. Verify session/cookie functionality

### Step 4: End-to-End Testing
1. Test complete user registration flow
2. Test login and authentication
3. Test membership activation
4. Test admin role assignment
5. Test message creation and deletion

## 📝 Environment Variables for Deployment

### Backend (Render Web Service)
```
DB_CONNECTION_STRING=postgresql://apex_protocol_user:BDlrWHNn6dq7P7dWdgw9Z9d6XfAEe9GO@dpg-d0t0cg49c44c738k3ce0-a.frankfurt-postgres.render.com/apex_protocol
MEMBERSHIP_PASSCODE=APEXPROTOCOL-ELITE77
SESSION_SECRET=qWzyAtFmQmSgp8LM9q1l2l6SHPGSTwYn
ADMIN_PASSCODE=APEXADMIN777
NODE_ENV=production
FRONTEND_URL=https://apex-protocol.netlify.app
```

### Frontend (Netlify)
```
NEXT_PUBLIC_BACKEND_URL=https://apex-protocol-backend.onrender.com
NODE_ENV=production
```

## 🧪 Test Accounts (Post-Deployment)
- **Guest User**: alice@example.com / password123
- **Member User**: bob@example.com / password123  
- **Admin+Member**: charlie@example.com / password123
- **Guest User**: diana@example.com / password123

**Membership Passcode**: `APEXPROTOCOL-ELITE77`
**Admin Passcode**: `APEXADMIN777`

## 🔗 Expected URLs
- **Backend API**: https://apex-protocol-backend.onrender.com
- **Frontend**: https://apex-protocol.netlify.app
- **Database**: Render PostgreSQL (already configured)

---
*Last Updated: May 30, 2025*
