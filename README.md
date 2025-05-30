# 🏛️ Apex Protocol - Private Clubhouse Platform

## 📋 Project Overview

**Apex Protocol** is a sophisticated private clubhouse web application designed for exclusive member communities. The platform enables strategic insights sharing with a unique **anonymity-by-default** model, where public viewers see anonymous content while verified members gain full author transparency and engagement capabilities.

### 🎯 Core Philosophy
- **Privacy First**: Default anonymity protects sensitive discussions
- **Merit-Based Access**: Membership requires exclusive passcode validation
- **Hierarchical Permissions**: Guest → Member → Admin privilege escalation
- **Strategic Focus**: Designed for high-value professional insights and analysis

---

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- **User Registration/Login**: Secure account creation with session-based authentication
- **Membership Enrollment**: Exclusive club access via passcode `APEXPROTOCOL-ELITE77`
- **Admin Role Assignment**: Administrative privileges via passcode `APEXADMIN777`
- **Session Persistence**: Secure cookie-based session management with automatic renewal

### 💬 **Message System**
- **Anonymous Publishing**: All users can create strategic insight posts
- **Conditional Visibility**: Author attribution visible only to verified members
- **Real-time Updates**: Instant message feed updates without page refresh
- **Content Moderation**: Admin-controlled message deletion with confirmation

### 👥 **User Tiers & Permissions**

#### **Guest Users (Non-Members)**
- View message titles and content
- See authors as "Anonymous User" with eye icon
- Timestamps displayed as "Time Hidden"
- Cannot see author identities or engagement details

#### **Verified Members**
- Full author attribution with colored avatars
- Complete timestamp visibility with relative time display
- Access to author profiles and engagement history
- Enhanced privacy notices and member-exclusive content

#### **Administrators**
- All member privileges plus administrative controls
- Message deletion capabilities with confirmation dialogs
- User management and content moderation tools
- System monitoring and configuration access

---

## 🛠️ Technical Architecture

### **Backend Stack**
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with connection pooling
- **Authentication**: Passport.js with session-based auth
- **Security**: bcrypt password hashing, CORS protection
- **Environment**: dotenv configuration management

### **Frontend Stack**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API with custom AuthContext
- **Icons**: Lucide React icon library
- **Navigation**: Next.js built-in routing and navigation

### **Database Schema**
```sql
-- Users table with authentication and role management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,  -- Stores email
    password_hash VARCHAR(255) NOT NULL,
    membership_status BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table with author attribution
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text_content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

### **1. Clone Repository**
```bash
git clone https://github.com/patrickthe1/apex-protocol.git
cd apex-protocol
```

### **2. Backend Setup**
```bash
cd backend
npm install

# Create PostgreSQL database
createdb apex_protocol

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

**Environment Configuration** (`.env`):
```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=apex_protocol
DB_PASSWORD=your_password
DB_PORT=5432
MEMBERSHIP_PASSCODE=APEXPROTOCOL-ELITE77
ADMIN_PASSCODE=APEXADMIN777
SESSION_SECRET=your_secure_session_secret
```

### **3. Database Initialization**
```bash
# Run schema creation
node db/createTables.js

# Seed with sample data (optional)
node db/seed.js
```

### **4. Frontend Setup**
```bash
cd ../frontend
npm install
```

### **5. Start Development Servers**

**Backend** (Terminal 1):
```bash
cd backend
npm start
# Server runs on http://localhost:8080
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
# Application runs on http://localhost:3000
```

---

## 🎮 User Guide

### **Getting Started**

#### **1. Create Account**
1. Navigate to `/signup`
2. Enter first name, last name, email, and password
3. Click "Create Account"
4. Redirect to login page

#### **2. Initial Login**
1. Navigate to `/login`
2. Enter email and password credentials
3. Access basic dashboard with guest privileges

#### **3. Join Club (Become Member)**
1. From dashboard, click "Join Our Exclusive Club"
2. Enter membership passcode: `APEXPROTOCOL-ELITE77`
3. Click "Activate Membership"
4. Immediately gain member privileges and UI updates

#### **4. Request Admin Access**
1. From dashboard, click "Admin Access" (members only)
2. Enter admin passcode: `APEXADMIN777`
3. Click "Grant Admin Access"
4. Immediately gain admin controls and moderation tools

### **Navigation & Features**

#### **Dashboard** (`/dashboard`)
- **Message Feed**: View all community insights and strategic posts
- **User Status**: Visual badges showing membership and admin status
- **Quick Actions**: Create new message, join club, or request admin access

#### **Create Message** (`/new-message`)
- **Title**: Strategic headline for your insight
- **Content**: Detailed analysis or discussion point
- **Privacy**: Published anonymously for guests, attributed for members

#### **Membership Pages**
- **Join Club** (`/join-club`): Exclusive membership enrollment
- **Admin Access** (`/admin-access`): Administrative privilege request

---

## 🔧 Development Guide

### **Project Structure**
```
apex-protocol/
├── backend/                 # Express.js API server
│   ├── config/             # Database and Passport configuration
│   ├── db/                 # Schema and seed scripts
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API route handlers
│   └── server.js           # Main server entry point
├── frontend/               # Next.js React application
│   ├── app/                # Next.js 14 App Router pages
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React Context providers
│   └── lib/                # Utility functions and configurations
└── README.md               # This documentation
```

### **Key Files**

#### **Backend Core**
- `server.js`: Express app configuration and middleware setup
- `config/db.js`: PostgreSQL connection pool management
- `config/passport-config.js`: Authentication strategy configuration
- `routes/authRoutes.js`: User authentication and role management
- `routes/messageRoutes.js`: Message CRUD operations

#### **Frontend Core**
- `app/layout.tsx`: Root layout with AuthProvider wrapper
- `contexts/AuthContext.tsx`: Global authentication state management
- `app/dashboard/page.tsx`: Main dashboard with conditional UI rendering
- `components/ui/`: Shadcn/ui component library integration

### **State Management Flow**

#### **Authentication Context**
```typescript
interface AuthContextType {
  user: User | null;              // Current authenticated user
  isLoading: boolean;             // Loading state for operations
  error: string | null;           // Error message display
  messages: Message[];            // Global message feed
  login: (email, password) => Promise<void>;
  logout: () => Promise<void>;
  signup: (...) => Promise<void>;
  joinClub: (passcode) => Promise<void>;
  grantAdminRole: (passcode) => Promise<void>;
  createMessage: (...) => Promise<void>;
  deleteMessage: (id) => Promise<void>;
}
```

#### **User Object Structure**
```typescript
interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  membershipStatus: boolean;      // Club membership flag
  isAdmin: boolean;               // Administrative privileges
  createdAt?: string;
}
```

### **API Integration**

#### **Authentication Flow**
1. **Frontend** calls AuthContext methods
2. **AuthContext** makes HTTP requests to backend API
3. **Backend** validates credentials and updates session
4. **Response** updates frontend state and triggers re-render
5. **UI** immediately reflects new permissions and status

#### **Session Management**
- Express sessions with secure cookie storage
- Automatic session renewal on authenticated requests
- Passport.js serialization/deserialization
- Session cleanup on logout

---

## 🧪 Testing

### **Manual Testing Checklist**

#### **Authentication Flow**
- [ ] User registration with validation
- [ ] Login with correct/incorrect credentials
- [ ] Session persistence across page refreshes
- [ ] Logout functionality and session cleanup

#### **Membership System**
- [ ] Guest user limitations (anonymous authors, hidden timestamps)
- [ ] Club join with correct/incorrect passcode
- [ ] Immediate UI updates after membership activation
- [ ] Member privileges (author names, timestamps visible)

#### **Admin System**
- [ ] Admin access with correct/incorrect passcode
- [ ] Immediate admin badge and controls appearance
- [ ] Message deletion functionality with confirmation
- [ ] Admin privileges maintained across sessions

#### **Message System**
- [ ] Message creation and validation
- [ ] Real-time feed updates without refresh
- [ ] Conditional visibility based on user tier
- [ ] Message deletion (admin only)

### **Development Testing**
```bash
# Backend API testing
cd backend
npm test

# Frontend component testing
cd frontend
npm test

# Integration testing
npm run test:integration
```

---

## 🚀 Deployment

### **Production Environment Setup**

#### **Backend Deployment**
1. **Environment Configuration**:
   ```env
   NODE_ENV=production
   DB_HOST=your-production-db-host
   DB_USER=your-production-db-user
   DB_PASSWORD=your-secure-db-password
   SESSION_SECRET=your-secure-session-secret-min-32-chars
   ```

2. **Database Setup**:
   ```bash
   # Production database creation
   createdb apex_protocol_prod
   
   # Run schema in production
   NODE_ENV=production node db/createTables.js
   ```

3. **Process Management**:
   ```bash
   # Using PM2 for production
   npm install -g pm2
   pm2 start server.js --name "apex-protocol-api"
   pm2 startup
   pm2 save
   ```

#### **Frontend Deployment**
1. **Build Production Bundle**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Static Hosting** (Vercel/Netlify):
   ```bash
   # Deploy to Vercel
   npx vercel --prod
   
   # Configure environment variables in hosting platform
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```

3. **Server Hosting**:
   ```bash
   # Self-hosted with PM2
   npm run build
   pm2 start npm --name "apex-protocol-web" -- start
   ```

### **Production Checklist**
- [ ] SSL certificates configured (HTTPS)
- [ ] Database connection pooling optimized
- [ ] Session store configured (Redis recommended)
- [ ] Error logging and monitoring setup
- [ ] Backup strategy implemented
- [ ] Security headers and CORS properly configured

---

## 🔒 Security Considerations

### **Implemented Security Measures**
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Session Security**: Secure cookies with HttpOnly and SameSite flags
- **CORS Protection**: Configured for frontend domain only
- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Prevention**: Parameterized queries throughout
- **XSS Protection**: Content sanitization and CSP headers

### **Additional Recommendations**
- Implement rate limiting for authentication endpoints
- Add CSRF protection for state-changing operations
- Set up proper logging and monitoring for security events
- Regular security audits and dependency updates
- Consider implementing 2FA for admin accounts

---

## 📝 Known Issues & Future Enhancements

### **Current Limitations**
- No email verification for new accounts
- Basic error handling (could be more granular)
- Limited admin management features
- No user profile editing capabilities

### **Planned Enhancements**
- **Email Integration**: Registration verification and notifications
- **Advanced Admin Panel**: User management, analytics, system settings
- **Enhanced Messaging**: Categories, tags, search functionality
- **Real-time Features**: Live notifications, typing indicators
- **Mobile Optimization**: Progressive Web App (PWA) capabilities
- **API Rate Limiting**: DDoS protection and abuse prevention

---

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Code Standards**
- **TypeScript**: Strict typing throughout frontend
- **ESLint**: Consistent code formatting and best practices
- **Prettier**: Automated code formatting
- **Comments**: Document complex logic and business rules

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For technical support or questions:
- **Documentation**: Review this README and API documentation
- **Issues**: Submit bug reports via GitHub Issues
- **Discussions**: Community discussions for feature requests

---

**Built with ❤️ by Patrick for exclusive communities seeking privacy and strategic insights sharing.**