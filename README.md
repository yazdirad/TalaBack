# 🌟 Jewelry Trading Platform - Backend

Multi-tenant jewelry trading platform built with NestJS, TypeORM, and SQL Server.

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- SQL Server 2019+

## 🚀 Quick Start

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/yazdirad/TalaBack.git
cd TalaBack
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment

\`\`\`bash
cp .env.example .env
# Edit .env with your database credentials
\`\`\`

### 4. Database Setup

First, run the SQL Server script to create the database:

\`\`\`bash
# Import the database schema from SQL Server
# File: database/schema.sql
\`\`\`

### 5. Start Application

\`\`\`bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
\`\`\`

The application will be available at: **http://localhost:3000**

API Documentation: **http://localhost:3000/api/docs**

## 📁 Project Structure
