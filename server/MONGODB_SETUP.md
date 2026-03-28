# MongoDB Atlas Setup Instructions

## 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free (free tier includes 512MB storage)
3. Create a new project and cluster

## 2. Get Connection String
1. In your Atlas cluster, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. It should look like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

## 3. Create .env File
Create a file named `.env` in the `server/` folder:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/expense-tracker?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Replace the values with your actual MongoDB credentials.

## 4. Install Dependencies
```bash
cd server
npm install
```

## 5. Start the Server
```bash
npm run dev    # Development with auto-reload
npm start      # Production mode
```

The server will run on `http://localhost:5000`

## Important Security Notes:
- Never commit `.env` file to git
- Change `JWT_SECRET` to a strong random value
- Use environment-specific credentials
- Keep your MongoDB password secure
