# 🚀 Azure SQL Connection - Quick Start (5 minutes)

## ✅ Done So Far

- ✅ Backend code updated for Azure SQL
- ✅ Dependencies installed (`mssql`, `@azure/identity`)
- ✅ `.env` file created with your connection string
- ✅ Database tables configured

## 📋 Next Steps (Only 3 steps!)

### **Step 1: Install Azure CLI** (if not already installed)

Azure CLI is needed for Azure AD authentication. Choose ONE:

**Windows - Easiest:**
```powershell
# Download and run installer
https://aka.ms/installazurecliwindows

# OR use winget
winget install Microsoft.AzureCLI
```

**Alternative (npm):**
```powershell
npm install -g @azure/cli
```

---

### **Step 2: Login to Azure**

Once Azure CLI is installed, login:

```powershell
az login
```

This will:
1. Open your browser automatically
2. Ask you to login with your Microsoft account
3. Show your subscriptions once logged in
4. Return to the terminal

✅ You should see a table with your Azure subscription

---

### **Step 3: Start the Server**

```powershell
cd server
npm run dev
```

#### ✅ You Should See:

```
🔵 Azure SQL Database connected successfully! ✓
✅ Database tables created/verified
🚀 Server running on http://localhost:5000
   API Health Check: http://localhost:5000/api/health
```

#### If No Tables Created Error - That's OK!

The first connection might timeout creating tables. Just restart:
```powershell
npm run dev
```

---

## 🧪 Test the Connection

Open another terminal:

```powershell
# Test health check
curl http://localhost:5000/api/health

# Should return:
# {"message":"Server is running"}
```

---

## 🎨 Start Frontend

In another terminal:

```powershell
npm run dev
```

Visit: `http://localhost:5173`

You're done! 🎉

---

## If Something Goes Wrong

### "Azure CLI not found"
Install it: https://aka.ms/installazurecliwindows

### "Login error / Not authenticated"
```powershell
az login
# Complete the browser login, then:
npm run dev
```

### "Database connection failed"
1. Make sure you're in the `server` folder
2. Check `.env` file exists and has connection string
3. Try: `az login` again
4. Restart server: `npm run dev`

### "Port 5000 already in use"
Either close the other process, or change PORT in `.env`:
```
PORT=5001
```

---

## 📊 Verify Your Database

Once server is running, open Azure Portal:

1. Go to: https://portal.azure.com
2. Search: "SQL Databases"
3. Click: "ExpenseCalculator"
4. Click: "Query editor" (left sidebar)
5. Login if prompted
6. Run this query:
   ```sql
   SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
   ```

You should see:
- users
- expenses  
- budgets
- recurringExpenses

✅ If you see these tables, your database is connected!

---

## 🎯 Full Flow

```
1. az login (Browser opens, you sign in)
   ↓
2. npm run dev (Server starts, connects to Azure)
   ↓
3. npm run dev (Frontend starts in different terminal)
   ↓
4. http://localhost:5173 (Open in browser)
   ↓
5. Sign up & add expenses
   ↓
6. Check Azure Portal - See your data! 🎉
```

---

## 📚 Your Files

```
server/
├── .env                    ← Connection string ✅ Created
├── AZURE_SQL_SETUP.md     ← Detailed guide ✅ Created
├── .env.example           ← Template for reference
├── package.json           ← Updated with mssql package ✅
├── src/
│   ├── db.js              ← Azure SQL connector ✅ Updated
│   ├── server.js          ← Uses new db.js ✅ Updated
│   └── routes/
│       ├── auth.js        ← Azure SQL queries ✅ Updated
│       ├── expenses.js    ← Azure SQL queries ✅ Updated
│       ├── budgets.js     ← Azure SQL queries ✅ Updated
│       └── recurring.js   ← Azure SQL queries ✅ Updated
```

All files are ready! Just login and start! ✨

---

## ⏱️ Timeline

- **Step 1** (Install Azure CLI): 2 minutes
- **Step 2** (Login): 1 minute  
- **Step 3** (Start server): 30 seconds
- **Total**: ~3-4 minutes

Easy! 🚀

---

*Last Updated: March 2026*
*ExpenseCalculator + Azure SQL Database*
