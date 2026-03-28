# 🚀 Expense Tracker with Cloud Storage (MongoDB Atlas)

Your expense tracker app now has **cloud storage** with **MongoDB Atlas**! All your data syncs across devices and is backed up securely.

## 📋 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas)
- npm or yarn

### Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for FREE (includes 512MB storage per month)
   - Create a new project and cluster

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### Step 2: Set Up Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with your MongoDB credentials
# Edit .env and add:
# MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/expense-tracker?retryWrites=true&w=majority
# PORT=5000
# JWT_SECRET=your_super_secret_key_change_in_production
# NODE_ENV=development

# Start the server
npm run dev
```

Server will run on **http://localhost:5000**

### Step 3: Set Up Frontend

```bash
# Go back to root directory
cd ..

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be available at **http://localhost:5173**

### Step 4: Create Your Account

1. Open http://localhost:5173 in your browser
2. Click "Sign Up" to create a new account
3. Enter your email and password
4. Start tracking expenses!

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│         Frontend (React + TypeScript)               │
│  http://localhost:5173                              │
│  - Add/Edit/Delete Expenses                         │
│  - Set Budgets & Track Spending                     │
│  - View Analytics & Charts                          │
│  - User Authentication                              │
└────────────────┬────────────────────────────────────┘
                 │ HTTP API (Axios)
                 ▼
┌─────────────────────────────────────────────────────┐
│         Backend (Express.js)                        │
│  http://localhost:5000                              │
│  - User Authentication (JWT)                        │
│  - REST API Endpoints                               │
│  - Database Operations                              │
└────────────────┬────────────────────────────────────┘
                 │ Mongoose ODM
                 ▼
┌─────────────────────────────────────────────────────┐
│      MongoDB Atlas (Cloud Database)                 │
│  - Expenses Database                                │
│  - Budgets Database                                 │
│  - Recurring Expenses                               │
│  - User Accounts & Authentication                   │
└─────────────────────────────────────────────────────┘
```

## 🗄️ Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  password: "hashed_password",
  createdAt: Date
}
```

### Expenses Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,  // Links to user
  description: "Lunch",
  amount: 25.50,
  category: "Food",
  date: "2024-03-28",
  notes: "Lunch with team",
  createdAt: Date
}
```

### Budgets Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  category: "Food",
  limit: 500,
  month: "2024-03",
  createdAt: Date
}
```

### Recurring Expenses Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  description: "Netflix subscription",
  amount: 15.99,
  category: "Entertainment",
  frequency: "monthly",
  startDate: "2024-01-01",
  createdAt: Date
}
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account

### Expenses
- `GET /api/expenses` - Get all your expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `DELETE /api/budgets/:id` - Delete budget

### Recurring Expenses
- `GET /api/recurring` - Get all recurring expenses
- `POST /api/recurring` - Add recurring expense
- `DELETE /api/recurring/:id` - Delete recurring expense

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **User Isolation**: Each user only sees their own data
- **CORS Protection**: Backend validates requests
- **Environment Variables**: Sensitive data in .env file

## 📊 Features Now Available

✅ **Cloud Storage** - Data in MongoDB Atlas  
✅ **Multi-Device Sync** - Access from any device  
✅ **User Accounts** - Email/Password authentication  
✅ **Data Backup** - Automatic cloud backup  
✅ **Expense Tracking** - Add, edit, delete expenses  
✅ **Budget Management** - Set and monitor budgets  
✅ **Recurring Expenses** - Track subscriptions  
✅ **Analytics** - Charts and spending insights  
✅ **Responsive Design** - Works on all devices  

## 🚀 Running Both Servers

You need to run **two terminals**:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

## 🧪 Test Credentials

After signing up, you can use your own credentials. Or use:
- **Email**: demo@example.com
- **Password**: demo123

## 📝 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

### Backend
```bash
npm run dev      # Start with auto-reload (nodemon)
npm start        # Start in production mode
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check your connection string in `.env`
- Verify IP address is whitelisted in MongoDB Atlas
- Ensure username/password are correct

### CORS Errors
- Make sure backend is running on http://localhost:5000
- Check that frontend is configured to use correct API URL

### Can't Login
- Verify backend server is running
- Check browser console for error messages
- Ensure MongoDB connection is active

### Port Already in Use
```bash
# Find and kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

## 📚 Learn More

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [JWT Authentication](https://jwt.io/)

## 🎯 Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Configure backend with .env
3. ✅ Start backend server
4. ✅ Start frontend server
5. ✅ Create account and log in
6. ✅ Start tracking expenses!

## ⚠️ Important Notes

- **Never commit .env file** to git - it contains sensitive data
- **Change JWT_SECRET** to a strong random value in production
- **Use environment-specific credentials** (don't share your MongoDB password)
- **Keep API running** while using the app

## 🤝 Support

If you encounter issues:
1. Check the MongoDB Atlas cluster status
2. Verify both servers are running
3. Check browser console for errors
4. Review server terminal output

Happy expense tracking! 💰📊
