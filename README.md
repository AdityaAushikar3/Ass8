# Student Records REST API (Node.js, Express.js & MongoDB)

A clean, beginner-friendly RESTful API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** implementing full CRUD (Create, Read, Update, Delete) operations.

---

## 📁 Project Structure

```
ass8/
├── config/
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   └── studentController.js  # CRUD business logic
├── models/
│   └── Student.js            # Mongoose Student Schema
├── routes/
│   └── studentRoutes.js      # Express API routes
├── .env                      # Environment variables (PORT, MONGO_URI)
├── package.json              # Project metadata & dependencies
├── postman_collection.json   # Ready-to-import Postman Collection
├── README.md                 # Documentation & Postman testing guide
└── server.js                 # Express application entry point
```

---

## 🚀 Setup & Running Locally

### 1. Install Dependencies
```bash
cd ass8
npm install
```

### 2. Make Sure MongoDB is Running
MongoDB should be running locally on the default port:
```
mongodb://127.0.0.1:27017/student_db
```

### 3. Start the Server
- **Production mode:**
  ```bash
  npm start
  ```
- **Development mode (with auto-restart):**
  ```bash
  npm run dev
  ```

Server will start on: **`http://localhost:5000`**

---

## 📌 API Endpoints Summary

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| **POST** | `/api/students` | Create a new student record | `201 Created` |
| **GET** | `/api/students` | Get all student records | `200 OK` |
| **GET** | `/api/students/:id` | Get student by MongoDB ID or Roll Number | `200 OK` |
| **PUT** | `/api/students/:id` | Update student details by ID or Roll Number | `200 OK` |
| **DELETE** | `/api/students/:id` | Delete student by ID or Roll Number | `200 OK` |

---

## 🧪 Postman Testing Guide

You can test all endpoints directly using **Postman**:

### Option A: 1-Click Import (Recommended)
1. Open **Postman**.
2. Click the **Import** button (top left).
3. Select the file: `ass8/postman_collection.json`.
4. All 5 CRUD requests will be loaded automatically!

---

### Option B: Manual Testing in Postman

#### 1. Create Student (POST)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/students`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "rollNo": "101",
    "name": "Aditya Aushikar",
    "email": "aditya@university.edu",
    "department": "Computer Science",
    "marks": 92
  }
  ```
- **Expected Status:** `201 Created`

---

#### 2. Get All Students (GET)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/students`
- **Expected Status:** `200 OK`
- **Response:**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "6709...",
        "rollNo": "101",
        "name": "Aditya Aushikar",
        "email": "aditya@university.edu",
        "department": "Computer Science",
        "marks": 92,
        "createdAt": "2026-10-12T..."
      }
    ]
  }
  ```

---

#### 3. Get Student by ID or Roll Number (GET)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/students/101`
- **Expected Status:** `200 OK`

---

#### 4. Update Student (PUT)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/students/101`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "marks": 96,
    "department": "Information Technology"
  }
  ```
- **Expected Status:** `200 OK`

---

#### 5. Delete Student (DELETE)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/students/101`
- **Expected Status:** `200 OK`
