// Azure SQL Database Connection Setup
import sql from 'mssql'
import 'dotenv/config.js'
import { DefaultAzureCredential } from '@azure/identity'

// Parse connection string or use individual credentials
const connectionString = process.env.AZURE_SQL_CONNECTION_STRING

const config = connectionString
  ? parseConnectionString(connectionString)
  : {
      server: process.env.AZURE_SQL_SERVER || 'expensecalculator.database.windows.net',
      database: process.env.AZURE_SQL_DATABASE || 'ExpenseCalculator',
      user: process.env.AZURE_SQL_USERNAME,
      password: process.env.AZURE_SQL_PASSWORD,
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectionTimeout: 30000,
        requestTimeout: 30000,
      },
    }

function parseConnectionString(connStr) {
  const params = {}
  connStr.split(';').forEach(param => {
    const [key, value] = param.split('=')
    if (key && value) {
      params[key.trim()] = value.trim()
    }
  })

  // Extract server and database
  const server = params['Server']?.replace('tcp:', '').split(',')[0] || 'expensecalculator.database.windows.net'
  const database = params['Initial Catalog'] || 'ExpenseCalculator'
  const userId = params['User Id']
  const password = params['Password']
  const authentication = params['Authentication']

  const config = {
    server,
    database,
    options: {
      encrypt: true,
      trustServerCertificate: false,
      connectionTimeout: parseInt(params['Connection Timeout']) || 30000,
      requestTimeout: 30000,
    },
  }

  // Add authentication based on what's in the connection string
  if (userId && password) {
    // SQL Authentication
    config.user = userId
    config.password = password
  } else if (authentication === 'Active Directory Integrated' || authentication === 'azure-active-directory-integrated') {
    // Managed Identity (App Service or local az login)
    config.authentication = {
      type: 'azure-active-directory-default',
      options: {
        credential: new DefaultAzureCredential()
      }
    }
  } else if (authentication === 'Active Directory Default' || !authentication) {
    // Default Azure AD
    config.authentication = {
      type: 'azure-active-directory-default',
      options: {
        credential: new DefaultAzureCredential()
      }
    }
  }

  return config
}

let pool

export async function connectToDatabase() {
  try {
    pool = new sql.ConnectionPool(config)
    await pool.connect()
    console.log('🔵 Azure SQL Database connected successfully! ✓')

    // Create tables if they don't exist
    await createTables()

    return pool
  } catch (error) {
    console.error('❌ Azure SQL Connection Error:', error.message)
    console.error('📋 Make sure your .env file has:')
    console.error(
      '   AZURE_SQL_CONNECTION_STRING=Server=tcp:expensecalculator.database.windows.net,1433;Initial Catalog=ExpenseCalculator;...'
    )
    console.error('   OR')
    console.error('   AZURE_SQL_SERVER=expensecalculator.database.windows.net')
    console.error('   AZURE_SQL_DATABASE=ExpenseCalculator')
    console.error('⚠️  Make sure you are logged in with Azure CLI: az login')
    process.exit(1)
  }
}

async function createTables() {
  try {
    const request = pool.request()

    // Users table
    await request.query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
      CREATE TABLE users (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        email NVARCHAR(255) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        createdAt DATETIME DEFAULT GETDATE()
      )
    `)

    // Expenses table
    await request.query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'expenses')
      CREATE TABLE expenses (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        userId UNIQUEIDENTIFIER NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category NVARCHAR(50) NOT NULL,
        description NVARCHAR(MAX),
        date DATE NOT NULL,
        createdAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Budgets table
    await request.query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'budgets')
      CREATE TABLE budgets (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        userId UNIQUEIDENTIFIER NOT NULL,
        category NVARCHAR(50) NOT NULL,
        limit DECIMAL(10, 2) NOT NULL,
        month INT NOT NULL,
        year INT NOT NULL,
        createdAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Recurring Expenses table
    await request.query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'recurringExpenses')
      CREATE TABLE recurringExpenses (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        userId UNIQUEIDENTIFIER NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category NVARCHAR(50) NOT NULL,
        frequency NVARCHAR(20) NOT NULL,
        description NVARCHAR(MAX),
        startDate DATE NOT NULL,
        createdAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    console.log('✅ Database tables created/verified')
  } catch (error) {
    console.error('⚠️  Error creating tables:', error.message)
  }
}

export function getPool() {
  if (!pool) {
    throw new Error('Database not connected. Call connectToDatabase() first.')
  }
  return pool
}

export async function closeDatabase() {
  if (pool) {
    await pool.close()
    console.log('🔌 Database connection closed')
  }
}
