# 🔌 Apex Protocol API Documentation

## 📋 Overview

The Apex Protocol backend provides a RESTful API built with Node.js and Express.js, featuring session-based authentication, PostgreSQL database integration, and role-based access control. This documentation covers all available endpoints, request/response formats, and authentication requirements.

**Base URL**: `http://localhost:8080` (Development)  
**Content-Type**: `application/json`  
**Authentication**: Session-based with cookies

---

## 🔐 Authentication Endpoints

### **POST** `/api/auth/register`
Create a new user account.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

#### Response
**Success (201)**:
```json
{
  "msg": "User registered successfully",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john.doe@example.com",
    "membershipStatus": false,
    "isAdmin": false,
    "createdAt": "2025-05-30T10:00:00.000Z"
  }
}
```

**Error (400)**:
```json
{
  "msg": "Email already exists"
}
```

---

### **POST** `/api/auth/login`
Authenticate user and create session.

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response
**Success (200)**:
```json
{
  "msg": "Login successful",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "username": "john.doe@example.com",
    "membership_status": false,
    "is_admin": false,
    "created_at": "2025-05-30T10:00:00.000Z"
  }
}
```

**Error (400)**:
```json
{
  "msg": "Invalid email or password"
}
```

---

### **GET** `/api/auth/logout`
Destroy user session and logout.

#### Response
**Success (200)**:
```json
{
  "msg": "Logged out successfully"
}
```

---

### **GET** `/api/auth/status`
Check current authentication status and user data.

**Authentication**: Required (session)

#### Response
**Authenticated (200)**:
```json
{
  "isAuthenticated": true,
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john.doe@example.com",
    "membershipStatus": true,
    "isAdmin": false,
    "createdAt": "2025-05-30T10:00:00.000Z"
  }
}
```

**Not Authenticated (200)**:
```json
{
  "isAuthenticated": false,
  "user": null
}
```

---

### **POST** `/api/auth/join-club`
Activate club membership with passcode.

**Authentication**: Required (session)

#### Request Body
```json
{
  "userId": 1,
  "passcode": "APEXPROTOCOL-ELITE77"
}
```

#### Response
**Success (200)**:
```json
{
  "msg": "Membership activated successfully",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john.doe@example.com",
    "membershipStatus": true,
    "isAdmin": false,
    "createdAt": "2025-05-30T10:00:00.000Z"
  }
}
```

**Error (400)**:
```json
{
  "msg": "Invalid membership passcode"
}
```

**Error (403)**:
```json
{
  "msg": "User already has membership"
}
```

---

### **POST** `/api/auth/grant-admin`
Grant administrative privileges with admin passcode.

**Authentication**: Required (session + membership)

#### Request Body
```json
{
  "userId": 1,
  "adminPasscode": "APEXADMIN777"
}
```

#### Response
**Success (200)**:
```json
{
  "msg": "Admin privileges granted successfully",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john.doe@example.com",
    "membershipStatus": true,
    "isAdmin": true,
    "createdAt": "2025-05-30T10:00:00.000Z"
  }
}
```

**Error (400)**:
```json
{
  "msg": "Invalid admin passcode"
}
```

**Error (403)**:
```json
{
  "msg": "Membership required for admin access"
}
```

---

## 💬 Message Endpoints

### **GET** `/api/messages`
Retrieve all messages with author information.

**Authentication**: Required (session)

#### Response
**Success (200)**:
```json
[
  {
    "id": 1,
    "title": "Strategic Market Analysis",
    "text_content": "Detailed analysis of current market trends...",
    "user_id": 2,
    "timestamp": "2025-05-30T09:30:00.000Z",
    "author": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "username": "jane.smith@example.com"
    }
  },
  {
    "id": 2,
    "title": "Investment Opportunities Q2",
    "text_content": "Key opportunities for the second quarter...",
    "user_id": 3,
    "timestamp": "2025-05-30T08:15:00.000Z",
    "author": {
      "id": 3,
      "first_name": "Robert",
      "last_name": "Johnson",
      "username": "robert.johnson@example.com"
    }
  }
]
```

**Error (401)**:
```json
{
  "msg": "Authentication required"
}
```

---

### **POST** `/api/messages`
Create a new message.

**Authentication**: Required (session)

#### Request Body
```json
{
  "title": "New Strategic Insight",
  "textContent": "This is the detailed content of the strategic insight..."
}
```

#### Response
**Success (201)**:
```json
{
  "msg": "Message created successfully",
  "message": {
    "id": 3,
    "title": "New Strategic Insight",
    "text_content": "This is the detailed content of the strategic insight...",
    "user_id": 1,
    "timestamp": "2025-05-30T11:00:00.000Z"
  }
}
```

**Error (400)**:
```json
{
  "msg": "Title and content are required"
}
```

**Error (401)**:
```json
{
  "msg": "Authentication required"
}
```

---

### **DELETE** `/api/messages/:id`
Delete a specific message (admin only).

**Authentication**: Required (session + admin role)

#### URL Parameters
- `id` (integer): Message ID to delete

#### Response
**Success (200)**:
```json
{
  "msg": "Message deleted successfully"
}
```

**Error (403)**:
```json
{
  "msg": "Admin privileges required"
}
```

**Error (404)**:
```json
{
  "msg": "Message not found"
}
```

**Error (401)**:
```json
{
  "msg": "Authentication required"
}
```

---

## 🧪 Test Endpoints

### **GET** `/api/test`
Simple connectivity test endpoint.

#### Response
**Success (200)**:
```json
{
  "message": "Backend server is running!",
  "timestamp": "2025-05-30T11:00:00.000Z"
}
```

---

### **GET** `/api/test/db`
Database connectivity test endpoint.

#### Response
**Success (200)**:
```json
{
  "message": "Database connection successful!",
  "timestamp": "2025-05-30T11:00:00.000Z"
}
```

**Error (500)**:
```json
{
  "message": "Database connection failed",
  "error": "Connection timeout"
}
```

---

## 🔧 Authentication & Session Management

### **Session Configuration**
- **Session Store**: Memory (development) / Redis (production recommended)
- **Cookie Name**: `connect.sid`
- **Cookie Settings**:
  - `httpOnly: true` - Prevents XSS access
  - `secure: false` (dev) / `true` (production with HTTPS)
  - `maxAge: 24 hours` - Session expiry time

### **Authentication Middleware**
All protected endpoints use the `requireAuth` middleware:

```javascript
// Authentication check
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ msg: 'Authentication required' });
}

// Admin role check
function requireAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  return res.status(403).json({ msg: 'Admin privileges required' });
}
```

### **Password Security**
- **Hashing Algorithm**: bcrypt with 10 salt rounds
- **Password Requirements**: Minimum 6 characters (configurable)
- **Storage**: Only password hashes stored, never plain text

---

## 📊 Database Schema

### **Users Table**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,  -- Email address
    password_hash VARCHAR(255) NOT NULL,
    membership_status BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Messages Table**
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text_content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚡ Data Transformations

### **Backend to Frontend Mapping**
The API performs automatic data transformation between database snake_case and frontend camelCase:

#### **User Object Transformation**
**Database (snake_case)**:
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "john.doe@example.com",
  "membership_status": true,
  "is_admin": false,
  "created_at": "2025-05-30T10:00:00.000Z"
}
```

**Frontend Response (camelCase)**:
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "username": "john.doe@example.com",
  "membershipStatus": true,
  "isAdmin": false,
  "createdAt": "2025-05-30T10:00:00.000Z"
}
```

### **Message Object with Author**
```json
{
  "id": 1,
  "title": "Strategic Analysis",
  "text_content": "Content here...",
  "user_id": 2,
  "timestamp": "2025-05-30T09:30:00.000Z",
  "author": {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "username": "jane.smith@example.com"
  }
}
```

---

## 🚨 Error Handling

### **Standard Error Response Format**
```json
{
  "msg": "Error description",
  "error": "Optional detailed error information"
}
```

### **HTTP Status Codes**
- **200**: Success
- **201**: Created successfully
- **400**: Bad request (validation errors, invalid input)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient privileges)
- **404**: Not found
- **500**: Internal server error

### **Common Error Scenarios**

#### **Authentication Errors**
```json
// Not logged in
{
  "msg": "Authentication required"
}

// Invalid credentials
{
  "msg": "Invalid email or password"
}
```

#### **Authorization Errors**
```json
// Insufficient privileges
{
  "msg": "Admin privileges required"
}

// Membership required
{
  "msg": "Membership required for admin access"
}
```

#### **Validation Errors**
```json
// Missing required fields
{
  "msg": "Title and content are required"
}

// Invalid passcode
{
  "msg": "Invalid membership passcode"
}

// Duplicate registration
{
  "msg": "Email already exists"
}
```

---

## 🔍 Request/Response Examples

### **Complete User Registration Flow**
```bash
# 1. Register new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securepass123",
    "confirmPassword": "securepass123"
  }'

# 2. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepass123"
  }'

# 3. Check auth status
curl -X GET http://localhost:8080/api/auth/status \
  -b cookies.txt

# 4. Join club
curl -X POST http://localhost:8080/api/auth/join-club \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "userId": 1,
    "passcode": "APEXPROTOCOL-ELITE77"
  }'

# 5. Create message
curl -X POST http://localhost:8080/api/messages \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "My Strategic Insight",
    "textContent": "This is my analysis of the current market..."
  }'
```

### **Admin Workflow**
```bash
# 1. Grant admin privileges (requires membership)
curl -X POST http://localhost:8080/api/auth/grant-admin \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "userId": 1,
    "adminPasscode": "APEXADMIN777"
  }'

# 2. Delete message (admin only)
curl -X DELETE http://localhost:8080/api/messages/1 \
  -b cookies.txt
```

---

## 🔒 Security Implementation

### **Session Security**
- **Secure Session Handling**: Express-session with secure configuration
- **Session Regeneration**: On authentication state changes
- **Session Timeout**: 24-hour expiry with sliding window
- **Cross-Site Scripting (XSS) Prevention**: HttpOnly cookies

### **Password Security**
```javascript
// Password hashing implementation
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Hash password during registration
const passwordHash = await bcrypt.hash(password, saltRounds);

// Verify password during login
const isValid = await bcrypt.compare(password, user.password_hash);
```

### **SQL Injection Prevention**
All database queries use parameterized statements:
```javascript
// Safe parameterized query
const query = 'SELECT * FROM users WHERE username = $1';
const result = await pool.query(query, [username]);
```

### **CORS Configuration**
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true                // Allow cookies
}));
```

---

## 📈 Performance Considerations

### **Database Connection Pooling**
```javascript
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20,          // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### **Recommended Production Optimizations**
- **Redis Session Store**: For session persistence across server restarts
- **Database Indexing**: Add indexes for frequently queried columns
- **Rate Limiting**: Implement request rate limiting for authentication endpoints
- **Caching**: Add caching layer for message feed and user data
- **Compression**: Enable gzip compression for API responses

---

## 🧪 Testing the API

### **Health Check Endpoints**
```bash
# Test server connectivity
curl http://localhost:8080/api/test

# Test database connectivity  
curl http://localhost:8080/api/test/db
```

### **API Testing Tools**
- **Postman**: Import collection for comprehensive API testing
- **curl**: Command-line testing examples provided above
- **Jest + Supertest**: Automated testing suite (recommended for development)

### **Sample Test Suite Structure**
```javascript
describe('Authentication API', () => {
  test('POST /api/auth/register - creates new user', async () => {
    // Test implementation
  });
  
  test('POST /api/auth/login - authenticates user', async () => {
    // Test implementation
  });
  
  test('GET /api/auth/status - returns user status', async () => {
    // Test implementation
  });
});

describe('Message API', () => {
  test('GET /api/messages - returns all messages', async () => {
    // Test implementation
  });
  
  test('POST /api/messages - creates new message', async () => {
    // Test implementation
  });
});
```

---

## 📞 Support & Troubleshooting

### **Common Issues**

#### **Database Connection Errors**
```bash
# Check PostgreSQL service
sudo service postgresql status

# Verify database exists
psql -U postgres -l | grep apex_protocol

# Test connection manually
psql -U postgres -d apex_protocol -c "SELECT NOW();"
```

#### **Session Issues**
- Ensure cookies are enabled in the client
- Check CORS configuration for credentials
- Verify session secret is set in environment variables

#### **Authentication Problems**
- Confirm user exists in database
- Check password hash comparison
- Verify session middleware is properly configured

### **Debug Mode**
Enable detailed logging by setting environment variable:
```bash
DEBUG=express:* node server.js
```

---

**API Documentation Version**: 1.0  
**Last Updated**: May 30, 2025  
**Backend Version**: 1.0.0