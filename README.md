# 🌍 CarePath — A Clinic Finder & Health Reminder System  
_For underserved communities_

CarePath is a lightweight health-access web application designed for communities with limited resources.  
It helps patients locate nearby public clinics, receive visit reminders, and access basic visit guidance.  
Community Health Workers (CHWs) and Admins can add field notes that improve patient decision-making.

This project was built as part of the Software Development Cycle course — demonstrating **requirements analysis**, **backend development**, **frontend development**, **authentication**, **data persistence**, and **feature integration**.

---

## ✨ Live Demo (Frontend)

You can view the deployed frontend here:

👉 **https://carepath-steel.vercel.app/**

_(Backend must be running locally for all features to work during review.)_

---

## ✨ Features

### 👤 **User features**
- Search for public clinics by:
  - Manual search (area/town)
  - By service offered
  - GPS location (HTML5 geolocation)
  - Adjustable radius (1km, 2km, 5km, 10km)
- View detailed clinic information (address, hours, services)
- Set **visit reminders** (SMS or WhatsApp)
- Manage personal profile (phone number, language, preferred channel)
- See upcoming reminders on the reminders dashboard

### 🏥 **Clinic data**
- Real clinic dataset imported from Kigali, Rwanda (CSV → JSON → Prisma seeding)
- Supports unlimited public clinics
- Stored in SQLite via Prisma ORM

### 🧑‍⚕️ **CHW & Admin**
- Add field notes to clinics
- View notes on clinic detail pages
- Protected routes (RequireAdmin / RequireCHW)

### 🔐 **Authentication**
- JWT-based login
- Admin, CHW, and normal user roles
- Protected endpoints

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express  
- Prisma ORM (SQLite)  
- JWT Authentication  
- Reminder Scheduler  
- Role-based authorization  

**Frontend**
- React + React Router  
- Axios API client  
- Auth Context  
- GPS + geolocation + radius filtering  
- Vite build tool  

---

# 📦 Installation & Setup

## 1️⃣ Clone the Repository
```sh
git clone https://github.com/<your-username>/carepath.git
cd carepath
```

---

# 🚀 Backend Setup (`carepath-backend`)

## 2️⃣ Install dependencies
```sh
cd carepath-backend
npm install
```

## 3️⃣ Create `.env` file
```
JWT_SECRET=supersecretkey
PORT=4000
DATABASE_URL="file:./dev.db"
```

## 4️⃣ Generate Prisma Client
```sh
npx prisma generate
```

## 5️⃣ Run DB migrations (creates tables)
```sh
npx prisma migrate dev --name init
```

## 6️⃣ Seed / Import Kigali Clinics (required!)
```sh
npm run import:kigali
```

## 7️⃣ Start the backend server
```sh
npm run dev
```

Backend runs at:
```
http://localhost:4000
```

---

# 💻 Frontend Setup (`carepath-frontend`)

## 1️⃣ Install dependencies
```sh
cd carepath-frontend
npm install
```

## 2️⃣ Create `.env` file
```
VITE_API_URL=http://localhost:4000/api
```

## 3️⃣ Start the React app
```sh
npm run dev
```

Frontend runs locally at:
```
http://localhost:5173
```

---

# 🌐 Deployed Frontend (Vercel)

The frontend is deployed via Vercel and accessible at:  
👉 **https://carepath-steel.vercel.app/**

> **Note:** For full functionality, the backend must be running locally at `http://localhost:4000/api`.  
---

# 🔑 Login Accounts (For Testing)

| Role | Email | Password |
|------|--------|----------|
| Admin | admin@carepath.test | admin123 |
| Regular User | user@carepath.test | user123 |

_(Adjust based on your seeded values.)_

---

# 📘 API Overview

### Auth
- `POST /api/auth/login`

### Clinics
- `GET /api/clinics`
- `GET /api/clinics/:id`
- `POST /api/clinics` (admin)
- `DELETE /api/clinics/:id` (admin)

### Notes
- `GET /api/clinics/:id/notes`
- `POST /api/clinics/:id/notes` (CHW/Admin)

### Reminders
- `POST /api/reminders`
- `GET /api/reminders?userId=`
- `PATCH /api/reminders/:id/cancel`

---

# 🧪 Running the System

### Option A — Use the deployed frontend:
1. Open **https://carepath-steel.vercel.app/**
2. Start backend locally (`npm run dev`)
3. Login → use all features normally

### Option B — Run everything locally:
1. Start backend (`4000`)
2. Start frontend (`5173`)
3. Navigate to `http://localhost:5173`

---


# 🏁 Final Notes  

CarePath demonstrates:
- Search functionality  
- Geolocation + radius filtering  
- Real clinic dataset  
- Field notes system  
- Appointment reminder system  
- Authentication with roles  
- Clean React + Node architecture  
- Full SRS alignment 

This project captures the complete lifecycle of a small health-access tool.

