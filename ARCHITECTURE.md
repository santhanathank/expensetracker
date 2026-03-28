# 🏗️ Cloud Storage Architecture & Data Flow

## System Overview

Your Expense Tracker app now uses a **3-tier architecture**:

```
┌──────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│                    (React Frontend)                          │
│  - Login/Signup Components                                   │
│  - Expense Management UI                                     │
│  - Budget Tracking Views                                     │
│  - Analytics & Charts                                        │
└─────────────────────────┬──────────────────────────────────┘
                          │ HTTP/REST API
                          │ JSON Data
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│                  (Express.js Server)                         │
│  Routes:                                                     │
│  - /api/auth    (Register, Login)                           │
│  - /api/expenses (CRUD operations)                          │
│  - /api/budgets (Create, Read, Delete)                      │
│  - /api/recurring (Manage recurring expenses)               │
│                                                              │
│  Features:                                                   │
│  - JWT Authentication                                       │
│  - Password Hashing (bcryptjs)                             │
│  - Mongoose ODM                                             │
│  - User Authorization                                       │
└─────────────────────────┬──────────────────────────────────┘
                          │ MongoDB Protocol
                          │ Mongoose Queries
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                     DATA LAYER                               │
│                  (MongoDB Atlas Cloud)                       │
│  Collections:                                                │
│  - users (Authentication)                                    │
│  - expenses (User transactions)                              │
│  - budgets (Monthly limits)                                  │
│  - recurringexpenses (Subscriptions)                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Example: Adding an Expense

### Step 1: User Input
```javascript
// In React Component (AddExpense.tsx)
User enters:
- Description: "Lunch"
- Amount: $25.50
- Category: "Food"
- Date: "2024-03-28"
- Notes: "Team lunch"

Clicks "Add Expense" button
```

### Step 2: API Call
```javascript
// Frontend (src/api.ts)
expensesAPI.create({
  description: "Lunch",
  amount: 25.50,
  category: "Food",
  date: "2024-03-28",
  notes: "Team lunch"
})

// Sends: POST http://localhost:5000/api/expenses
// Headers: Authorization: Bearer <JWT_TOKEN>
// Body: { expense data }
```

### Step 3: Server Processing
```javascript
// Backend (server/src/routes/expenses.js)
1. authMiddleware extracts userId from JWT token
2. Creates expense object:
   {
     userId: "507f1f77bcf86cd799439011",  // User's ID
     description: "Lunch",
     amount: 25.50,
     category: "Food",
     date: "2024-03-28",
     notes: "Team lunch",
     createdAt: "2024-03-28T10:30:00Z"
   }
3. Saves to MongoDB
4. Returns expense with _id
```

### Step 4: Database Storage
```javascript
// MongoDB Collection: expenses
{
  _id: ObjectId("507f191e810c19729de860ea"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  description: "Lunch",
  amount: 25.50,
  category: "Food",
  date: "2024-03-28",
  notes: "Team lunch",
  createdAt: ISODate("2024-03-28T10:30:00.000Z")
}
```

### Step 5: Response Back to Frontend
```javascript
// Server sends back: 201 Created
{
  _id: "507f191e810c19729de860ea",
  userId: "507f1f77bcf86cd799439011",
  description: "Lunch",
  amount: 25.50,
  category: "Food",
  date: "2024-03-28",
  notes: "Team lunch",
  createdAt: "2024-03-28T10:30:00Z"
}
```

### Step 6: UI Update
```javascript
// Frontend updates state
setExpenses([...expenses, newExpense])

// Component re-renders to show new expense in list
```

---

## 🔐 Authentication Flow

### Registration Flow
```
1. User enters email + password
2. Frontend calls: POST /api/auth/register
3. Server:
   - Validates input
   - Checks if email exists
   - Hashes password with bcryptjs
   - Creates user in MongoDB
   - Generates JWT token
4. Server returns: { token, user }
5. Frontend:
   - Stores token in localStorage
   - Stores user info
   - Redirects to app
```

### Login Flow
```
1. User enters email + password
2. Frontend calls: POST /api/auth/login
3. Server:
   - Finds user by email
   - Compares password hash
   - If valid, generates JWT token
4. Server returns: { token, user }
5. Frontend stores token and user info
6. All future requests include token in header
```

### Logout Flow
```
1. User clicks "Logout"
2. Frontend:
   - Removes token from localStorage
   - Clears user state
   - Redirects to login
3. Next request without token gets 401 Unauthorized
```

---

## 📡 API Endpoints Detail

### Authentication

#### POST /api/auth/register
```
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (201 Created):
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

#### POST /api/auth/login
```
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

### Expenses

#### GET /api/expenses
```
Headers: Authorization: Bearer <token>

Response (200 OK):
[
  {
    "_id": "507f191e810c19729de860ea",
    "userId": "507f1f77bcf86cd799439011",
    "description": "Lunch",
    "amount": 25.50,
    "category": "Food",
    "date": "2024-03-28",
    "notes": "Team lunch"
  },
  ...
]
```

#### POST /api/expenses
```
Headers: Authorization: Bearer <token>

Request:
{
  "description": "Lunch",
  "amount": 25.50,
  "category": "Food",
  "date": "2024-03-28",
  "notes": "Team lunch"
}

Response (201 Created):
{
  "_id": "507f191e810c19729de860ea",
  "userId": "507f1f77bcf86cd799439011",
  "description": "Lunch",
  "amount": 25.50,
  "category": "Food",
  "date": "2024-03-28",
  "notes": "Team lunch",
  "createdAt": "2024-03-28T10:30:00Z"
}
```

#### PUT /api/expenses/:id
```
Headers: Authorization: Bearer <token>

Request:
{
  "description": "Lunch (updated)",
  "amount": 30.00,
  "category": "Food",
  "date": "2024-03-28"
}

Response (200 OK):
{ updated expense object }
```

#### DELETE /api/expenses/:id
```
Headers: Authorization: Bearer <token>

Response (200 OK):
{
  "message": "Expense deleted"
}
```

---

## 🗄️ MongoDB Database Schema

### Users Collection
```javascript
db.users.find()
[
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    email: "user@example.com",
    password: "$2a$10$N9q...", // hashed
    createdAt: ISODate("2024-03-28T08:00:00Z")
  }
]
```

### Expenses Collection
```javascript
db.expenses.find()
[
  {
    _id: ObjectId("507f191e810c19729de860ea"),
    userId: ObjectId("507f1f77bcf86cd799439011"),
    description: "Lunch",
    amount: 25.50,
    category: "Food",
    date: "2024-03-28",
    notes: "Team lunch",
    createdAt: ISODate("2024-03-28T10:30:00Z")
  }
]

// Create index for faster queries
db.expenses.createIndex({ userId: 1 })
db.expenses.createIndex({ createdAt: -1 })
```

### Budgets Collection
```javascript
db.budgets.find()
[
  {
    _id: ObjectId("507f191e810c19729de860eb"),
    userId: ObjectId("507f1f77bcf86cd799439011"),
    category: "Food",
    limit: 500,
    month: "2024-03",
    createdAt: ISODate("2024-03-28T10:30:00Z")
  }
]
```

### Recurring Expenses Collection
```javascript
db.recurringexpenses.find()
[
  {
    _id: ObjectId("507f191e810c19729de860ec"),
    userId: ObjectId("507f1f77bcf86cd799439011"),
    description: "Netflix subscription",
    amount: 15.99,
    category: "Entertainment",
    frequency: "monthly",
    startDate: "2024-01-01",
    createdAt: ISODate("2024-03-28T10:30:00Z")
  }
]
```

---

## 🔑 JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1711619400,      // issued at
  "exp": 1712224200       // expires in 7 days
}

Signature:
HMAC256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "your_secret_key"
)
```

When decoded:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MTE2MTk0MDAsImV4cCI6MTcxMjIyNDIwMH0.
T8e4R9e7x5K3yZ2m1n9j0k8l7p6q5r4s3t2u1v0w
```

---

## 🔌 Communication Protocols

### Frontend → Backend
```
Protocol: HTTP/HTTPS (REST API)
Format: JSON
Port: 5000
Base URL: http://localhost:5000/api

Example:
POST /api/expenses HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGcii...
Content-Type: application/json

{"description":"Lunch","amount":25.50,...}
```

### Backend → MongoDB
```
Protocol: MongoDB Wire Protocol
Connection String: mongodb+srv://user:pass@cluster.mongodb.net/dbname
Driver: Mongoose (Node.js ODM)

Example:
const expense = await Expense.create({
  userId: new ObjectId("507f1f77..."),
  description: "Lunch",
  amount: 25.50,
  category: "Food",
  date: "2024-03-28"
})
```

---

## 🚀 Performance Considerations

### Current Setup
- **Frontend**: React with client-side rendering
- **Backend**: Express.js single server
- **Database**: MongoDB Atlas shared cluster
- **Scale**: Suitable for 10,000+ users

### For Production, Consider:
1. **Load Balancing**: Scale to multiple backend instances
2. **Caching**: Redis for frequently accessed data
3. **CDN**: Serve frontend static files faster
4. **Database Sharding**: Split data across multiple servers
5. **Monitoring**: Add New Relic/DataDog for insights

---

## 📚 Files Overview

```
server/
├── src/
│   ├── server.js              - Express app setup
│   ├── middleware/
│   │   └── auth.js           - JWT authentication
│   ├── models/
│   │   ├── User.js           - User schema
│   │   ├── Expense.js        - Expense schema
│   │   ├── Budget.js         - Budget schema
│   │   └── RecurringExpense.js
│   └── routes/
│       ├── auth.js           - Register/Login endpoints
│       ├── expenses.js       - Expense CRUD endpoints
│       ├── budgets.js        - Budget endpoints
│       └── recurring.js      - Recurring endpoints
├── .env                        - Configuration (secrets)
└── package.json
```

---

Now your expense tracker is enterprise-ready! 🎉
