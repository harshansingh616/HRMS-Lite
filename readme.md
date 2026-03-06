# HRMS Lite (Full-Stack)

A lightweight Human Resource Management System (HRMS Lite) for managing employee records and tracking daily attendance.
Built as a simple internal admin tool with a clean UI and REST APIs.

## Live Links
- **Frontend (Vercel):** https://hrms-lite-ruddy-eight.vercel.app/
- **Backend API (Render):** https://hrms-lite-lwj1.onrender.com
- **GitHub Repo:** https://github.com/harshansingh616/HRMS-Lite

## Features

### Employee Management
- Add a new employee:
  - Employee ID (unique)
  - Full Name
  - Email (unique, valid email format)
  - Department
- View all employees
- Delete an employee

### Attendance Management
- Mark attendance for an employee:
  - Date (YYYY-MM-DD stored in backend; UI date input may display per browser locale)
  - Status (Present / Absent)
- View attendance records per employee
- Attendance summary per employee:
  - Total Records / Total Present / Total Absent

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express (REST API)
- MongoDB Atlas
- Mongoose
- Zod (validation)

### Deployment
- Backend: Render
- Frontend: Vercel

## API Endpoints

### Employees
- `GET /api/employees` — list employees
- `POST /api/employees` — create employee
- `DELETE /api/employees/:employeeId` — delete employee

### Attendance
- `POST /api/attendance` — mark attendance (upsert by employeeId + date)
- `GET /api/attendance/:employeeId` — list attendance records for employee
- `GET /api/attendance/:employeeId/summary` — attendance summary counts

## Run Locally

### Prerequisites
- Node.js (LTS recommended)
- MongoDB Atlas account (or local MongoDB)
- Git

---
