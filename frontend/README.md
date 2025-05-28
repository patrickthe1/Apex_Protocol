# Apex Protocol Prototype

A sophisticated, exclusive clubhouse web application designed for strategic minds to share and discover high-signal insights with a unique anonymity-by-default approach.

## Project Overview

**Apex Protocol** is a private, exclusive platform where verified strategists and thought leaders can share intelligence and insights. The core innovation is **anonymity by default for public viewing, with author identities revealed only to verified members**.

### Key Features

- **Anonymous Public Access**: Non-members see high-quality content without author attribution
- **Member Transparency**: Verified members see full author identities and can engage directly
- **Strategic Focus**: Curated, high-signal content from verified strategic professionals
- **Exclusive Access**: Membership by invitation/passcode only
- **Admin Controls**: Administrative oversight and content moderation capabilities

## Generated Components

### Pages

1. **Landing Page** (`app/page.tsx`)
   - Hero section with compelling value proposition
   - Anonymous content teasers
   - Membership benefits explanation
   - Call-to-action buttons for signup, login, and membership

2. **Sign Up Page** (`app/signup/page.tsx`)
   - User registration form with validation
   - Fields: First Name, Last Name, Email, Password, Confirm Password
   - Client-side validation with error handling

3. **Sign In Page** (`app/login/page.tsx`)
   - User authentication form
   - Email and password fields
   - Mock authentication with localStorage

4. **Membership Access** (`app/join-club/page.tsx`)
   - Exclusive passcode entry for membership activation
   - Success/error feedback
   - Demo passcode: `APEX2024`

5. **Dashboard/Home Feed** (`app/dashboard/page.tsx`)
   - Main content feed with conditional display logic
   - Member vs non-member view simulation
   - Admin controls for content moderation
   - Status toggle controls for demo purposes

6. **Create Message** (`app/new-message/page.tsx`)
   - Form for composing strategic insights
   - Content validation and publishing guidelines
   - Privacy and attribution notices

7. **Admin Access** (`app/admin-access/page.tsx`)
   - Administrative privilege activation
   - Demo admin code: `APEX_ADMIN_2024`
   - Security notices and access controls

## Mock Data & Simulation

The prototype uses localStorage to simulate different user states:

### Authentication States
- `isLoggedIn`: Controls access to authenticated features
- `isMember`: Determines content visibility (anonymous vs attributed)
- `isAdmin`: Enables administrative controls

### Demo Credentials
- **Member Passcode**: `APEX2024`
- **Admin Code**: `APEX_ADMIN_2024`

### Testing Different States

1. **Non-Member Experience**:
   - Visit landing page and dashboard
   - Content shows as anonymous with hidden timestamps
   - Limited engagement options

2. **Member Experience**:
   - Use passcode `APEX2024` in `/join-club`
   - Full author attribution and timestamps visible
   - Enhanced engagement capabilities

3. **Admin Experience**:
   - Use admin code `APEX_ADMIN_2024`
   - Access to delete buttons on messages
   - Full system oversight capabilities

### Mock Message Data

The dashboard displays 5 sample strategic insights with realistic content covering:
- DeFi and blockchain strategy
- Market positioning analysis
- AI infrastructure investment
- Regulatory arbitrage opportunities
- Supply chain disruption patterns

## Integration Guide

### Backend Integration

To evolve this prototype into a full-stack application:

#### 1. API Endpoints Setup

Replace mock localStorage with actual API calls:

\`\`\`javascript
// Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me

// Membership
POST /api/membership/verify-passcode
GET /api/membership/status

// Messages
GET /api/messages
POST /api/messages
DELETE /api/messages/:id

// Admin
POST /api/admin/verify-code
GET /api/admin/users
DELETE /api/admin/users/:id
\`\`\`

#### 2. Authentication Token Management

Replace localStorage authentication with JWT tokens:

\`\`\`javascript
// Store JWT in httpOnly cookies or secure localStorage
const token = response.data.token;
localStorage.setItem('authToken', token);

// Add token to API requests
const config = {
  headers: { Authorization: `Bearer ${token}` }
};
\`\`\`

#### 3. State Management

Implement global state management using React Context or Zustand:

\`\`\`javascript
// User Context
const UserContext = createContext();

// User state
const [user, setUser] = useState({
  isAuthenticated: false,
  isMember: false,
  isAdmin: false,
  profile: null
});
\`\`\`

#### 4. Form Submission Integration

Wire up forms to backend endpoints:

\`\`\`javascript
// Replace mock form handlers
const handleLogin = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    setUser(response.data.user);
    router.push('/dashboard');
  } catch (error) {
    setErrors(error.response.data.errors);
  }
};
\`\`\`

### Database Schema Recommendations

\`\`\`sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  is_member BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Membership codes table
CREATE TABLE membership_codes (
  id UUID PRIMARY KEY,
  code VARCHAR UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Security Considerations

1. **Password Security**: Implement bcrypt for password hashing
2. **JWT Security**: Use secure, httpOnly cookies for token storage
3. **Rate Limiting**: Implement rate limiting on authentication endpoints
4. **Input Validation**: Server-side validation for all form inputs
5. **CORS Configuration**: Proper CORS setup for production deployment

## Styling & Design System

### Tailwind CSS Configuration

The prototype uses a custom dark theme with the following color palette:

- **Primary**: Blue variants (blue-400, blue-600, blue-700)
- **Secondary**: Purple variants (purple-400, purple-600, purple-700)
- **Background**: Slate variants (slate-900, slate-950)
- **Accent**: Green and red for status indicators

### shadcn/ui Components Used

- Button, Card, Input, Label, Textarea
- All components are pre-styled for the dark theme
- Consistent spacing and typography throughout

### Customization Tips

1. **Color Scheme**: Modify Tailwind config for brand colors
2. **Typography**: Adjust font families in globals.css
3. **Animations**: Add custom animations for enhanced UX
4. **Responsive Design**: All components are mobile-first responsive



## Development Commands

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React hooks (localStorage for demo)
- **Routing**: Next.js App Router

## Contributing

This prototype serves as a foundation for the full Apex Protocol application. When contributing:

1. Maintain the dark, professional aesthetic
2. Follow the established component patterns
3. Ensure responsive design principles
4. Test all user state combinations
5. Document any new features or changes

---

**Apex Protocol** - Strategic intelligence for the discerning mind.
