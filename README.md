# Email Marketing Scheduler & Distributor

A robust, scalable full-stack application for scheduling and sending marketing emails with rate limiting, concurrency control, and fault tolerance.

## 📂 Project Structure

This project is organized as a monorepo:

- **`backend/`** (Root Directory): Node.js + Express + TypeScript backend handling scheduling, queues, and email dispatch.
- **`frontend/`** (Frontend Directory): React + Vite + Tailwind CSS dashboard for managing campaigns.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Database)
- Redis (Message Queue & Caching)
- An Ethereal Email account (for testing) or a customized SMTP provider.

### 1. Backend Setup

The backend handles the core logic, job processing, and API endpoints.

1.  **Navigate to the root directory**:
    ```bash
    cd email-project
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory with the following variables:
    ```env
    # Server
    PORT=3000
    
    # Database (PostgreSQL)
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASS=your_password
    DB_NAME=email_scheduler
    
    # Redis (BullMQ)
    REDIS_HOST=localhost
    REDIS_PORT=6379
    
    # Email Service (Ethereal / SMTP)
    SMTP_HOST=smtp.ethereal.email
    SMTP_PORT=587
    SMTP_USER=your_ethereal_email
    SMTP_PASS=your_ethereal_password
    
    # Worker Settings
    WORKER_CONCURRENCY=5
    ```

4.  **Run the Server**:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

### 2. Frontend Setup

The frontend provides a modern, responsive dashboard.

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    Access the dashboard at `http://localhost:5173` (or the port shown in terminal).

---

## 🏗️ Architecture Overview

### 1. Scheduling System
- **Immediate & Future Scheduling**: Users can choose to send emails immediately or pick a specific date/time.
- **Logic**: When a request is received, the backend calculates the delay (`scheduledTime - currentTime`). This delay is passed to **BullMQ**, which holds the job in a `delayed` state within Redis until the execution time, ensuring precise delivery.

### 2. Persistence & Fault Tolerance
- **Database (PostgreSQL)**: All email metadata (recipient, subject, body, status) is stored in Postgres. This serves as the single source of truth.
- **Queue (Redis)**: Jobs are stored in Redis. If the server crashes, Redis retains the job state.
- **Re-hydration**: On server restart, the application can check for any 'PENDING' jobs in the database that might have been missed and re-queue them (though BullMQ handles persistent jobs automatically).
- **Idempotency**: Included `idempotencyKey` prevents duplicate emails if the client retries requests.

### 3. Rate Limiting
- **Implementation**: A custom Token Bucket or Fixed Window counter is implemented using Redis.
- **Mechanism**: Before sending, the worker checks the number of emails sent by the user in the last hour. If the limit is exceeded, the job is **rescheduled** for the next hour automatically.

### 4. Concurrency
- **BullMQ Workers**: The worker is configured with a `concurrency` setting (default: 5). This allows processing 5 emails in parallel, maximizing throughput without overwhelming the server or SMTP provider.

---

## ✅ Features Implemented

### Backend
- [x] **Email Scheduler**: Precise scheduling using BullMQ delayed jobs.
- [x] **Persistence**: PostgreSQL integration for reliable data storage.
- [x] **Rate Limiting**: Automatic throttling and rescheduling if limits are hit.
- [x] **Concurrency**: Parallel job processing for high volume.
- [x] **Fault Tolerance**: Automatic retries for temporary failures (e.g., SMTP auth errors).
- [x] **REST API**: Endpoints for scheduling, tracking, and history.

### Frontend
- [x] **Modern Dashboard**: Built with React, Tailwind CSS, and Glassmorphism design.
- [x] **Campaign Management**: Compose and schedule emails with CSV upload support.
- [x] **Live Tracking**: View status of Scheduled and Sent emails.
- [x] **User Authentication**: Google Login (Firebase) and Demo Mode support.
- [x] **Responsive Design**: Fully optimized for desktop and mobile.

---

## 🛡️ License

Private Repository.
