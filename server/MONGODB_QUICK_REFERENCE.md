# 📌 MongoDB Atlas Quick Reference Card

Print this or keep it open while setting up! 

---

## 🔗 Important Links

| What | Link |
|------|------|
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas |
| Sign Up | https://account.mongodb.com/account/register |
| Dashboard | https://cloud.mongodb.com/ |
| Docs | https://docs.mongodb.com/atlas/ |
| Support | https://support.mongodb.com |

---

## 📋 Default Values to Use

| Setting | Value | Notes |
|---------|-------|-------|
| Project Name | `expense-tracker` | Custom name for your project |
| Cluster Name | `Cluster0` | You'll use this in connection string |
| Database Name | `expense-tracker` | For organizing data |
| Database User | `expense_tracker_user` | Username for connection |
| Cloud Provider | AWS | Most reliable |
| Instance Tier | M0 (FREE) | 512MB monthly, no charge |
| Node.js Driver | 3.12+ | For backend connection |

---

## 🔐 Credentials Template

Save this with your real values:

```
Website: MongoDB Atlas
Email: ___________________________
Password: ___________________________

Database Connection:
Username: expense_tracker_user
Password: ___________________________
Connection String:
mongodb+srv://___:___@_____.mongodb.net/___?retryWrites=true&w=majority

API Port: 5000
JWT Secret: your_secret_key_here
```

---

## 🎯 Step-by-Step at a Glance

### Step 1: SIGN UP
```
URL: https://www.mongodb.com/cloud/atlas
Click: "Try Free"
→ Create email/password account
→ Verify email
→ Login
```

### Step 2: CREATE PROJECT
```
Click: "Create a Project"
Name: expense-tracker
Click: "Create Project"
```

### Step 3: BUILD DATABASE
```
Click: "Build a Database"
Choose: FREE (M0)
Click: "Create"
→ Select AWS region
→ Click "Create Cluster"
→ ⏳ Wait 5-10 minutes
```

### Step 4: CREATE USER
```
Username: expense_tracker_user
Password: Generate (copy & save!)
Click: "Create User"
```

### Step 5: NETWORK ACCESS
```
Click: "Network Access" (left menu)
Click: "Add IP Address"
Choose: Current IP or 0.0.0.0/0
Click: "Confirm"
→ ⏳ Wait for "Active"
```

### Step 6: GET CONNECTION STRING
```
When cluster shows "Available":
Click: "Connect"
Choose: "Drivers"
Select: Node.js 3.12+
COPY: Connection String
```

### Step 7: CREATE .env FILE
```
Location: server/.env
Copy-paste:

MONGODB_URI=YOUR_CONNECTION_STRING_HERE
PORT=5000
JWT_SECRET=secret_key_here
NODE_ENV=development
```

### Step 8: TEST
```
Terminal 1:
cd server && npm run dev

Check for:
✅ 📦 MongoDB connected

Terminal 2:
npm run dev
→ Open http://localhost:5173
```

---

## ⚡ Connection String Format

### What MongoDB Gives You:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### What You Need to Do:
```
Replace <username> with:
  expense_tracker_user

Replace <password> with:
  YOUR_SAVED_PASSWORD

Add database name at the end:
  /expense-tracker?retryWrites=true&w=majority
```

### Final Result:
```
mongodb+srv://expense_tracker_user:MyPassword123@cluster0.abc123.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

---

## ✅ Verification Checklist

After each major step, verify:

| Step | What to Check | Should See |
|------|--------------|-----------|
| 1 | Email verification | Email received ✅ |
| 2 | Project created | Project name in sidebar ✅ |
| 3 | Cluster created | "Cluster0" with "Available" status ✅ |
| 4 | User created | User listed under "Database Users" ✅ |
| 5 | Network access | "Active" status under IPs ✅ |
| 6 | Connection | No copy errors ✅ |
| 7 | .env file | File saved in server/ folder ✅ |
| 8 | Backend test | "MongoDB connected" message ✅ |

---

## 🆘 Quick Troubleshooting

| Problem | Check | Solution |
|---------|-------|----------|
| Cluster won't load | Wait time | MongoDB takes 10-15 min, be patient |
| Connection fails | Username/password | Verify exact spelling, copy carefully |
| Auth error | Credentials | Check .env file has correct password |
| Backend won't start | Connection string | Make sure no typos, paste exact string |
| Data not saving | MongoDB status | Ensure cluster shows "Available" |
| Can't add IP | Network access | Choose "0.0.0.0/0" instead |

---

## 📍Navigation in MongoDB Atlas

```
After Login:
├─ Databases (see clusters)
│  ├─ Cluster0 (your cluster)
│  └─ Browse Collections (see data)
├─ Database Access (manage users)
├─ Network Access (manage IP addresses)
├─ Monitoring & Alerts (view activity)
└─ Settings (manage account)
```

---

## 🎬 Getting Started After Setup

### Create Test Expense:
```
1. Go to http://localhost:5173
2. Sign up: test@example.com / test123456
3. Add expense: "Lunch" - $25.50
4. Check MongoDB → see data!
```

### View Your Data:
```
1. MongoDB Atlas Dashboard
2. Databases → Browse Collections
3. Click "expenses"
4. See your expense record!
```

---

## 🔐 Security Reminder

Never share:
- ❌ Connection string (contains password)
- ❌ Database password
- ❌ JWT_SECRET
- ❌ .env file

Always:
- ✅ Save credentials safely
- ✅ Use strong passwords
- ✅ Add .env to .gitignore
- ✅ Rotate credentials periodically

---

## 📞 Getting Help

If stuck:
1. Check this card again
2. Read MONGODB_SETUP_DETAILED.md
3. Visit https://docs.mongodb.com/atlas/
4. Contact MongoDB support

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Account Creation | 2 min |
| Cluster Setup | 10 min |
| Wait for Cluster | 5-10 min |
| User & Network | 5 min |
| Get String | 2 min |
| App Config | 3 min |
| Test | 2 min |
| **TOTAL** | **~30 min** |

---

### ✨ Once Complete: You Have:
- ✅ Cloud database
- ✅ Automatic backups  
- ✅ Global access
- ✅ Free tier (512MB/month)
- ✅ Enterprise security

**You're ready to go! 🚀**
