# AutoForge: Careers & Garage ⚡
### Full-Stack MERN Web Application (100% TypeScript)
**Coursework Assignment:** ITS2020 - Rapid Application Development (RAD)  
**Institution:** Institute of Java and Software Engineering (IJSE)  
**Graduate Diploma in Software Engineering (GDSE)**  
**Student Name:** Dinesh Tharusha  
**Repository:** [https://github.com/Dineshtharusha/RAD-Autoforge-careers-and-Garage](https://github.com/Dineshtharusha/RAD-Autoforge-careers-and-Garage)  
**Live Deployed Frontend:** `https://autoforge-garage.vercel.app` *(or configured cloud host)*  
**Live Deployed Backend:** `https://autoforge-api.onrender.com`  

---

## 1. Project Overview & Business Value

**AutoForge: Careers & Garage** is an enterprise-grade full-stack automotive web application designed to bridge high-performance garage services with elite automotive career pathways. Built adhering strictly to **Rapid Application Development (RAD)** principles and modern client-server architectural standards, the system features a dark luxury aesthetic inspired by flagship automotive marques (Porsche, BMW M, Mercedes-AMG).

### Core Business Capabilities:
1. **Premium Garage Services Catalog:** Browse, filter, and inspect detailed specifications for specialized automotive maintenance (High-Performance Oil Changes, Brembo Brake Upgrades, OEM Telemetry Diagnostics, 9H Ceramic Detailing, Engine Blueprints, and Laser Wheel Alignments).
2. **State-of-the-Art Regional Workshop Network:** Discover superhub facilities across **Galle, Hikkaduwa, and Ambalangoda** featuring active bay counts, technician headcounts, and specialized capabilities.
3. **Real-Time Bay Reservation & Scheduling:** Interactive appointment booking with instant service selection, vehicle telemetry data capture, date/slot picker, and live status tracking (`pending`, `confirmed`, `in-progress`, `completed`, `cancelled`).
4. **Automotive Careers & Master Guild Recruitment:** Explore high-salary technician roles, performance tuner openings, and submit comprehensive career applications with certification and experience records.
5. **AI Vehicle Diagnostic Assistant (Advanced Feature #1):** An intelligent automotive diagnostic engine powered by the Gemini architecture that analyzes real-time customer symptom reports, error codes, and vehicle mileage to deliver root-cause diagnostics, severity rankings, safety guidance, and estimated repair costs.
6. **PDF Tax Invoice & Work Order Generator (Advanced Feature #2):** Client-side vector PDF generation that outputs official branded tax invoices with QR verification, breakdown of labor charges, and 12-month factory warranty stamps.
7. **Executive Analytics Dashboard (Advanced Feature #3):** Real-time administrative business intelligence console monitoring revenue, service bay occupancy rates, booking pipelines, and career applicant vetting.
8. **Supabase Cloud Media & Document Storage (Advanced Feature #4):** Integration with Supabase Cloud Storage (`@supabase/supabase-js`) enabling candidate resume document uploads (PDF/DOC) and customer vehicle condition photo uploads with instant public asset resolution.

---

## 2. Technology Stack

### Frontend Architecture
- **Framework:** React 18 with TypeScript (`.tsx`)
- **Build Tool:** Vite 5 (ultra-fast HMR and bundling)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)
- **Styling:** TailwindCSS 3 (custom dark carbon palette, gold ambient glows, frosted glassmorphism)
- **Icons:** Lucide React
- **HTTP Client:** Axios (with Bearer JWT request/response interceptors)
- **Document Export:** jsPDF (vector PDF invoice generator)
- **Cloud Storage:** Supabase Storage (`@supabase/supabase-js`) for candidate resumes and vehicle photo attachments

### Backend Architecture
- **Runtime:** Node.js (v20+ / v22+)
- **Server Framework:** Express.js with TypeScript (`strict: true`)
- **Database:** MongoDB & MongoDB Atlas
- **Object Data Modeling (ODM):** Mongoose 8 (strong typing, schema validators, indexes)
- **Authentication:** JSON Web Tokens (JWT) with HMAC SHA-256 signing
- **Security:** bcryptjs (10-round salted password hashing), CORS, dotenv
- **Development Tooling:** `ts-node-dev`, `typescript` compiler

---

## 3. System Architecture & Database Design

### Client-Server Architecture Flow
```
┌────────────────────────────────────────────────────────┐
│               Client (React 18 + TypeScript)           │
│  - Redux Store (Auth, Services, Workshops, Bookings)   │
│  - Glassmorphic UI (TailwindCSS)                       │
│  - jsPDF Engine (Client Invoice Creation)              │
└───────────────▲────────────────────────┬───────────────┘
                │                        │
       JSON API │ (Axios + JWT)          │ REST Requests (GET, POST, PUT, DELETE)
                │                        ▼
┌───────────────┴────────────────────────────────────────┐
│            Backend API (Node.js + Express + TS)        │
│  - Middleware: JWT Auth, Admin Guards, Error Handler   │
│  - Controllers: Auth, Services, Bookings, AI, Analytics│
│  - AI Diagnostic Engine (Gemini Architecture)          │
└───────────────▲────────────────────────┬───────────────┘
                │                        │
     Mongoose   │ Queries                │ BSON Documents
                ▼                        ▼
┌────────────────────────────────────────────────────────┐
│             MongoDB Database (Atlas / Local)           │
│  Collections: Users, Services, Workshops, Bookings,    │
│               Jobs, Applications                       │
└────────────────────────────────────────────────────────┘
```

### Database Models & Entity Relationships
- **User:** `name`, `email` (unique index), `password` (bcrypt hashed), `role` (`customer` | `admin` | `technician`), `phone`, `avatar`.
- **Service:** `name`, `slug` (unique index), `shortDescription`, `fullDescription`, `category` (indexed), `price`, `durationHours`, `iconName`, `features`, `isPopular`, `warrantyMonths`.
- **Workshop:** `name`, `city` (indexed), `country`, `address`, `phone`, `email`, `baysCount`, `techniciansCount`, `specialization`, `rating`, `operatingHours`, `amenities`, `isActive`.
- **Booking:** `user` (ref: User), `service` (ref: Service), `workshop` (ref: Workshop), `vehicle` (`make`, `model`, `year`, `plateNumber`, `mileage`), `appointmentDate`, `timeSlot`, `status`, `totalAmount`, `paymentStatus`, `invoiceNumber` (unique).
- **Job:** `title`, `department`, `location`, `type`, `experienceLevel`, `salaryRange`, `description`, `responsibilities`, `requirements`, `benefits`, `isOpen`.
- **Application:** `job` (ref: Job), `user` (ref: User), `fullName`, `email`, `phone`, `currentRole`, `yearsOfExperience`, `certifications`, `portfolioOrLinkedIn`, `status`.

---

## 4. RESTful API Endpoints Specification

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer/technician |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |
| `PUT` | `/api/auth/me` | Private | Update user account profile |
| `GET` | `/api/services` | Public | Retrieve catalog with category/search filters |
| `GET` | `/api/services/:idOrSlug` | Public | Retrieve single service specification |
| `POST` | `/api/services` | Admin | Create new garage service offering |
| `PUT` | `/api/services/:id` | Admin | Update service details and pricing |
| `DELETE` | `/api/services/:id` | Admin | Remove service from active catalog |
| `GET` | `/api/workshops` | Public | Retrieve all workshops with city filter |
| `GET` | `/api/workshops/:id` | Public | Retrieve single workshop details |
| `POST` | `/api/workshops` | Admin | Add new workshop superhub |
| `POST` | `/api/bookings` | Private | Book service bay appointment |
| `GET` | `/api/bookings/my` | Private | Get authenticated user's bookings |
| `GET` | `/api/bookings` | Admin | View all system bookings across hubs |
| `PATCH` | `/api/bookings/:id/status` | Admin | Update bay status (`in-progress`, `completed`, etc.) |
| `GET` | `/api/jobs` | Public | View active career openings |
| `POST` | `/api/applications` | Public/Auth | Submit job application & credentials |
| `GET` | `/api/applications` | Admin | View all submitted career applications |
| `PATCH` | `/api/applications/:id/status`| Admin | Update candidate status (`under_review`, etc.) |
| `POST` | `/api/ai/diagnose` | Public | Run Gemini AI vehicle symptom diagnostic |
| `GET` | `/api/analytics/dashboard` | Admin | Get executive financial and operational KPIs |

---

## 5. Setup & Installation Guide

### Prerequisites
- **Node.js:** v18.0.0 or later (v20+ recommended)
- **npm:** v9.0.0 or later
- **MongoDB:** Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` OR a free MongoDB Atlas cluster connection string.

### Step 1: Clone the Repository
```bash
git clone https://github.com/Dineshtharusha/RAD-Autoforge-careers-and-Garage.git
cd RAD-Autoforge-careers-and-Garage
```

### Step 2: Configure Environment Variables
Inside `server/`, create a `.env` file (refer to `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/autoforge
JWT_SECRET=autoforge_super_secret_jwt_key_2026
GEMINI_API_KEY=your_optional_gemini_api_key_here
```

### Step 3: Install Dependencies
From the repository root:
```bash
# Install both backend and frontend dependencies
npm run install:server
npm run install:client
```

### Step 4: Seed Database with Initial Data
Run the comprehensive seed script to populate sample services, superhubs, jobs, and demo users:
```bash
npm run seed
```

**Default Demonstration Accounts:**
- **Executive Admin:** `admin@autoforge.com` / `adminpassword123`
- **Valued Customer:** `alexander@autoforge.com` / `customerpassword123`
*(Quick auto-fill buttons are provided on the login modal)*

### Step 5: Start Development Servers
**Terminal 1 (Backend API):**
```bash
npm run dev:server
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
# Vite opens on http://localhost:5173
```

---

## 6. Coursework Evaluation Compliance Matrix

| Evaluation Criteria | Weight | Compliance Implementation in AutoForge |
|---|---|---|
| **Functionality & Business Logic** | 15% | Full CRUD implemented for Services, Bookings, Workshops, and Applications. Real-time status changes and calculations. |
| **Code Quality & TypeScript** | 10% | **100% TypeScript** across both `client` and `server`. Zero `any` shortcuts in models and strict type interfaces. |
| **UI/UX Design & Responsiveness** | 5% | Pixel-perfect realization of the provided design mockups: custom gold gradients, glowing circular badges, frosted glassmorphism, responsive navigation. |
| **Authentication & State Management** | 10% | Role-based JWT authentication (`customer`, `admin`), bcrypt password hashing, and global state management via Redux Toolkit. |
| **Deployment & Documentation** | 5% | Multi-platform deployment configuration for Vercel (client), Render (server), and MongoDB Atlas database. Comprehensive documentation. |
| **AI or Extra Features** | 5% | 1) Gemini-powered Vehicle Diagnostic Assistant; 2) Vector PDF Tax Invoice Generator (`jsPDF`); 3) Executive Analytics Dashboard. |
| **Presentation Defense (Viva)** | 50% | Complete modular code separation (`models/`, `controllers/`, `routes/`, `middleware/`, `config/`), seed data, and demo auto-fill for seamless demonstration. |

---

## 7. License & Authorship
Developed by **Dinesh Tharusha** for the Rapid Application Development (RAD) Final Coursework Module, IJSE Graduate Diploma in Software Engineering (GDSE).

