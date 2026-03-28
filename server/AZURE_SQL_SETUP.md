# 🔵 Azure SQL Database Setup Guide

## ✅ You Have Your Connection String!

You've provided this connection string:
```
Server=tcp:expensecalculator.database.windows.net,1433;Initial Catalog=ExpenseCalculator;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication="Active Directory Default";
```

Great! This means:
- ✅ Azure SQL Database created
- ✅ Using Azure Active Directory authentication
- ✅ Server: `expensecalculator.database.windows.net`
- ✅ Database: `ExpenseCalculator`

---

## 📋 Setup Steps (3 minutes total)

### Step 1: Install Dependencies

```bash
cd server
npm install
```

This installs:
- `mssql` - Azure SQL driver
- `@azure/identity` - Azure AD authentication

---

### Step 2: Create `.env` File

In the `server/` folder, create a file named `.env` with this content:

```
AZURE_SQL_CONNECTION_STRING=Server=tcp:expensecalculator.database.windows.net,1433;Initial Catalog=ExpenseCalculator;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication="Active Directory Default";

PORT=5000
JWT_SECRET=your_secret_key_expense_tracker_123
NODE_ENV=development
```

⚠️ **Important:**
- Make sure file is named `.env` (not `.env.txt` or `.env.example`)
- Put it in the `server/` folder (not the root folder!)
- Never commit this file to git

---

### Step 3: Login with Azure CLI

Since your connection uses "Active Directory Default" authentication, you need to be logged in to Azure:

```bash
az login
```

This opens a browser where you sign in with your Azure account.

✅ You should see: `You have logged in. Now let us find all the subscriptions under your account.`

---

### Step 4: Start the Backend Server

```bash
npm run dev
```

#### ✅ Expected Output:
```
🔵 Azure SQL Database connected successfully! ✓
✅ Database tables created/verified
🚀 Server running on http://localhost:5000
   API Health Check: http://localhost:5000/api/health
```

#### ❌ If You See an Error:

**Error: "Login failed"**
```
Make sure:
1. You ran: az login
2. You waited for browser to complete login
3. Your Azure account has access to the database
```

**Error: "Connection timeout"**
```
Make sure:
1. Network access is configured in Azure Portal
2. Your IP is allowed (Add IP in Azure Portal → ExpenseCalculator → Networking)
```

---

### Step 5: Test the Connection

Open browser and go to:
```
http://localhost:5000/api/health
```

✅ You should see:
```json
{ "message": "Server is running" }
```

---

## 🚀 Start the Frontend

In a **new terminal** (keep backend running):

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## ✨ Test the Full App

1. **Sign Up**: Create a test account
2. **Add Expense**: Add a test expense
3. **Check Database**: Go to Azure Portal → SQL Databases → ExpenseCalculator → Query Editor

You should see your user and expense in the database! ✅

---

## 🔧 Troubleshooting

### "Azure AD authentication not available"

**Fix:**
```bash
# Make sure you're logged in
az logout
az login
```

Then restart your backend:
```bash
npm run dev
```

---

### "Database tables are missing"

**Fix:** The tables are created automatically on first connection. If they're not there:

1. Check Azure Portal → SQL Databases → Query Editor
2. Run this query to verify connection:
```sql
SELECT name FROM sys.tables;
```

If no tables appear, they'll be created on next server restart.

---

### "Connection string format error"

**Make sure your .env file has NO extra quotes:**

✅ Correct:
```
AZURE_SQL_CONNECTION_STRING=Server=tcp:expensecalculator.database.windows.net,1433;Initial Catalog=ExpenseCalculator;...
```

❌ Wrong:
```
AZURE_SQL_CONNECTION_STRING="Server=tcp:expensecalculator.database.windows.net,1433;..."  ← Don't add extra quotes!
```

---

### "IP not allowed to connect"

**Fix:** Add your IP to Azure SQL firewall:

1. Go to Azure Portal
2. Click on `expensecalculator` (SQL Server)
3. Click "Networking" (left sidebar)
4. Click "Add your client IP" button  
5. Click "Save"
6. Wait 1-2 minutes
7. Try again

---

## 📊 Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:5000/api/health
# Should return: {"message":"Server is running"}
```

### Create Account (Test)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Should return token and user info
```

### Get Expenses
```bash
curl http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 What's Next?

✅ Backend running
✅ Database connected  
✅ Tables created
✅ Ready to use!

Now:
1. Open frontend at `http://localhost:5173`
2. Sign up with an account
3. Add some expenses
4. Watch them save to Azure SQL! 🎉

---

## 📚 File Structure

```
server/
├── .env                 ← Your credentials (NEVER commit!)
├── .env.example         ← Template (safe to commit)
├── src/
│   ├── server.js        ← Main server
│   ├── db.js            ← Azure SQL connection
│   ├── middleware/
│   │   └── auth.js      ← JWT auth
│   └── routes/
│       ├── auth.js      ← Login/Register
│       ├── expenses.js  ← Expense CRUD
│       ├── budgets.js   ← Budget CRUD
│       └── recurring.js ← Recurring CRUD
└── package.json         ← Dependencies
```

---

## 🔐 Security Notes

1. **Never commit .env file** - It has your database secrets!
2. **Use strong JWT_SECRET** - Change from the default
3. **Keep passwords safe** - Don't share your .env file
4. **Azure AD helps** - Your connection uses Azure's security

---

## ✅ Success Checklist

- [ ] Ran `npm install` in server folder
- [ ] Created `.env` file with connection string
- [ ] Ran `az login` and completed login
- [ ] Backend shows "Azure SQL Database connected"
- [ ] Health check returns `{"message":"Server is running"}`
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Can create account and add expenses
- [ ] Data appears in Azure Portal Query Editor

**When all checked: 🎉 You're done! Your cloud database is live!**

---

## 📞 Quick Reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Start backend | `npm run dev` |
| Check Azure login | `az login` |
| View database tables | Azure Portal → Query Editor |
| Health check | `curl http://localhost:5000/api/health` |

---

*Last Updated: 2024*  
*For: Expense Tracker + Azure SQL Database*
