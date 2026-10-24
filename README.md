# AgriProducts Marketplace & Payment System

A full-stack agricultural e-commerce platform and payment processing system featuring multi-category cataloging, passwordless OTP authentication (Email & Mobile), cart management, server-side pricing verification, and flexible payment gateway integration.

---

## 🛠️ Technology Stack Breakdown

### 1. Frontend Technologies Used

| Technology | Version / Tool | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | **React 19** | Component-based, reactive user interface |
| **Build Tool & Dev Server** | **Vite 8** | High-speed bundling, hot module replacement (HMR), and API reverse proxy |
| **Client-Side Routing** | **React Router DOM 7** | Multi-page routing, authentication guards, and navigation |
| **Icons** | **Lucide React** | Modern, lightweight UI icon library |
| **Styling & Design System** | **Vanilla CSS & CSS Variables** | Custom responsive design system, glassmorphism, micro-animations, and theme variables |
| **API Client** | **Native Fetch API Service** | Custom centralized API client handling JWT bearer tokens, session persistence (`X-Session-Key`), and error handling |
| **Linting & Code Quality** | **Oxlint** | High-performance JavaScript/JSX linter |

---

### 2. Backend Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Language & Runtime** | **Python 3** | Core backend programming language |
| **Web Framework** | **Django 5.x** | Enterprise web framework providing ORM, admin panel, middleware, and core security |
| **API Framework** | **Django REST Framework (DRF)** | RESTful API endpoints, request validation, serializers, and permission policies |
| **Authentication & Tokens** | **djangorestframework-simplejwt** & Custom JWT Layer | Secure token-based authentication with access and refresh token lifecycle |
| **CORS Middleware** | **django-cors-headers** | Cross-Origin Resource Sharing for seamless frontend-backend communication |
| **Media & Image Handling** | **Pillow** | Image processing and storage for product media |
| **Environment Management** | **python-dotenv** | Loading sensitive credentials and configurations from `.env` |
| **OTP & Notification Services** | **Twilio SDK** & **Django SMTP** | Multi-channel OTP delivery for passwordless authentication via SMS and Email |
| **Payment Gateway Integration** | **Modular Gateway Architecture** | Pluggable payment service supporting **Mock Sandbox** (for development), **Razorpay**, and **Stripe** |

---

### 3. Database Used

The project supports both lightweight local development and production-grade relational databases:

* **Primary / Development Database: SQLite3 (`sqlite3`)**
  * File: `backend/db.sqlite3`
  * Zero-configuration, serverless database enabled by default for rapid local development and testing.
* **Production Database Support: PostgreSQL (`psycopg2-binary`, `dj-database-url`)**
  * Configurable via the `DATABASE_URL` environment variable (e.g., `postgres://user:password@localhost:5432/agri_db`).
  * If `DATABASE_URL` is provided, Django connects to PostgreSQL with connection pooling (`conn_max_age=600`).
  * If `DATABASE_URL` is not set, it gracefully defaults to local SQLite3.

---

## 🚀 How to Run the Project

Follow the steps below to run both the backend and frontend on your machine.

### Prerequisites
* **Python 3.10+** installed
* **Node.js (v18+)** and **npm** installed
* Git

---

### Part A: Running the Backend

#### 1. Open a terminal and navigate to the project root
```bash
cd "d:\Payment system"
```

#### 2. Activate the Virtual Environment

* **On Windows (PowerShell):**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
  *(If script execution is disabled, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*

* **On Windows (Command Prompt):**
  ```cmd
  .\venv\Scripts\activate.bat
  ```

* **On macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```

*(If you need to create a fresh virtual environment: `python -m venv venv`)*

#### 3. Navigate to the `backend` folder and install dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 4. Configure Environment Variables
Copy `.env.example` to `.env` (if not already created):
* **Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
* **macOS / Linux / Git Bash:**
  ```bash
  cp .env.example .env
  ```
Ensure `DEBUG=True` and `PAYMENT_PROVIDER=mock` are configured in `.env` for local testing.

#### 5. Run Database Migrations
```bash
python manage.py migrate
```

#### 6. (Optional) Populate Sample Products & Create Admin User
* Populate the agriculture catalog with pre-configured products and categories:
  ```bash
  python manage.py seed_agriculture_products
  ```
* Create a superuser for the Django admin dashboard:
  ```bash
  python manage.py createsuperuser
  ```

#### 7. Start the Django Backend Server
```bash
python manage.py runserver
```
The backend API is now running at: **`http://127.0.0.1:8000/`**  
Django Admin dashboard is accessible at: **`http://127.0.0.1:8000/admin/`**

---

### Part B: Running the Frontend

#### 1. Open a new terminal window and navigate to the `frontend` folder
```bash
cd "d:\Payment system\frontend"
```

#### 2. Install Node Dependencies
```bash
npm install
```

#### 3. Start the Vite Development Server
```bash
npm run dev
```

The frontend application will start and display the local development URL:
👉 **`http://localhost:5173/`**

> **Note:** The Vite development server has a pre-configured reverse proxy in [vite.config.js](file:///d:/Payment%20system/frontend/vite.config.js) that automatically routes all `/api` and `/media` requests to `http://127.0.0.1:8000`, eliminating any CORS issues during development.

---

## 🌐 Application Services & Ports Summary

| Service | Port / URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:5173` | React + Vite UI (Marketplace, Cart, Checkout, Auth) |
| **Backend REST API** | `http://127.0.0.1:8000/api/` | Django REST Framework endpoints |
| **Django Admin Panel** | `http://127.0.0.1:8000/admin/` | Product catalog, user, and order administration |
| **API Proxy** | `/api/*` -> `http://127.0.0.1:8000` | Configured inside Vite dev server |
