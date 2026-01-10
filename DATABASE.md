 
---

### `database_setup.sql` / `DB_Queries.md`

```markdown
# PrimeTrade Database Initialization

This document contains the SQL queries required to set up the MySQL database for the PrimeTrade Financial Simulator.

## 1. Create the Database
```sql
CREATE DATABASE IF NOT EXISTS primetrade_db;
USE primetrade_db;

```

## 2. Create Users Table

This table handles authentication and Role-Based Access Control (RBAC).

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

## 3. Create Trades Table

This table stores the persistent ledger of all simulated transactions. It uses a Foreign Key to link trades to specific users.

```sql
CREATE TABLE trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    asset_name VARCHAR(20) NOT NULL,
    trade_type ENUM('buy', 'sell') NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,  -- Supports fractional shares/crypto
    price DECIMAL(18, 2) NOT NULL,   -- Supports standard currency precision
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraint
    -- If a user is deleted, all their associated trades are also deleted
    CONSTRAINT fk_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

```

## 4. Verification Queries

Use these to check if your tables were created correctly:

```sql
-- Check table structure
DESCRIBE users;
DESCRIBE trades;

-- Check total users and trades
SELECT role, COUNT(*) FROM users GROUP BY role;
SELECT COUNT(*) FROM trades;

```

## 5. Sample Data (Optional)

```sql
-- Manual Admin Insertion (Password: 'admin123' - replace with hashed version in production)
INSERT INTO users (username, email, password, role) 
VALUES ('system_admin', 'admin@primetrade.com', '$2b$10$YourHashedPasswordHere', 'admin');

```
 