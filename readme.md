# 💳 Banking Ledger System

A production-inspired backend system that simulates how real-world banking transactions are processed using ledger-based accounting.

This project focuses on ensuring **data consistency, reliability, and secure transaction handling** using Node.js, Express, and MongoDB.

---

## 🚀 Features

### 🔐 Authentication
- User registration & login
- JWT-based authentication (cookies + headers)
- Protected routes using middleware
- Secure logout with token blacklisting

---

### 👤 Account Management
- Create user accounts
- Account status handling:
  - ACTIVE
  - FROZEN
  - CLOSED
- Default currency support (INR)
- Fetch user accounts
- Get account balance dynamically

---

### 💸 Transaction System
- Transfer funds between accounts
- Transaction status flow:
  - PENDING
  - COMPLETED
  - FAILED
  - REVERSED
- System-based initial funding API
- Email notifications on transactions

---

### 📒 Ledger System (Core Concept 🔥)
- Tracks all balance changes using **debit & credit entries**
- Immutable ledger entries (cannot be modified)
- Balance is derived using ledger aggregation
- Ensures accurate financial tracking

---

### 🔁 Idempotency
- Prevents duplicate transactions using unique idempotency keys
- Safe retry mechanism for transaction APIs

---

### 🔐 Security Enhancements
- Token blacklist model for logout
- Expiring blacklisted tokens (TTL index)
- Validation of account status before transactions

---

### ⚙️ Database Transactions
- MongoDB sessions for atomic operations
- Ensures consistency across:
  - Transaction creation
  - Ledger updates
  - Status updates

---

## 🧱 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Nodemailer
- Cookie Parser

---

## 📂 Project Structure

src/
│
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
└── app.js



---

## 🔗 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

---

### Accounts
- POST /api/accounts
- GET /api/accounts
- GET /api/accounts/balance/:accountId

---

### Transactions
- POST /api/transactions
- POST /api/transactions/system/initial-funds

---

## 🔄 Workflow

User → Account → Transaction → Ledger

- Users create accounts  
- Transactions move money between accounts  
- Ledger stores debit/credit entries  
- Balance is calculated from ledger  

---

## 🧠 Key Concepts Implemented

- RESTful API design  
- Ledger-based accounting system  
- Idempotency in APIs  
- MongoDB transactions (sessions)  
- Role of debit & credit entries  
- Token blacklisting (logout security)  
- Email service integration  

---

## 🛠️ Setup Instructions

```bash
# Clone repository
git clone https://github.com/sunnyrawal/banking-ledger.git

# Install dependencies
npm install

# Create .env file



# Server
PORT=3000

# Database
MONGO_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_super_secret_key

# Email (Nodemailer - Gmail / OAuth2)
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token
EMAIL_USER=your_email@gmail.com



# Run server
npm run dev
```