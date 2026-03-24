# NEU Library Visitor Log System

A modern full-stack web application for managing library visitor logs at NEU (Nueva Ecija University).

## Features

✅ **User Authentication** - Secure login with JWT tokens  
✅ **Visitor Logging** - Easy form to log library visits with reason, department, and category  
✅ **Admin Dashboard** - View statistics, visitor logs, and analytics by college  
✅ **Responsive Design** - Beautiful modern UI that works on desktop and mobile  
✅ **Real-time Updates** - Live statistics and log retrieval

## Project Structure

```
IM2_Project/
├── backend/
│   ├── server.js              # Main Express server
│   ├── .env                   # Environment variables
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── VisitLog.js       # Visit log schema
│   └── routes/
│       ├── auth.js           # Authentication routes
│       ├── logs.js           # Visitor log routes
│       └── admin.js          # Admin dashboard routes
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main app component
    │   ├── App.css           # Styling
    │   ├── pages/
    │   │   ├── UserPage.jsx  # User visitor log form
    │   │   └── AdminDashboard.jsx # Admin statistics
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas URI)
- **npm** or **yarn**

## Installation

### 1. Clone/Extract the Project

```bash
cd c:\Users\MyPC\Desktop\IM2_Project
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Configuration

### Backend Setup

1. **Database Setup** (Choose one):

  MongoDB Atlas (Cloud)**
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get your connection string
   - Update `.env` file

2. **Environment Variables** (already configured):

## Running the Application

### Terminal 1: Start MongoDB (if using local)

```bash
# Windows
mongod
```

### Terminal 2: Start Backend

```bash
cd backend
npm start
# or
node server.js
```

Expected output:
```
Server running on http://localhost:5000
MongoDB connected successfully
```

### Terminal 3: Start Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v8.0.0  ready in 150ms

➜  Local:   http://localhost:5173/
```

## Accessing the Application

1. Open browser and go to: **(https://neu-library-visitor-logbook.vercel.app/)**
2. Click "Login" button
3. You'll be logged in as the admin user

## Test Credentials

- **Admin Account**:
- **Regular User**: Any email ending with `@neu.edu.ph` or `@gmail.com`

## Features Walkthrough

### 👤 User Features

1. **Log Your Visit**
   - Select reason for visit (Reading, Researching, Using Computer, etc.)
   - Choose your college/department
   - Select your category (Student, Faculty, Staff, Visitor)
   - Submit the form

2. **View My Visits**
   - See your recent visitor logs
   - View date, time, reason, college, and category

### 🛠️ Admin Features

1. **Dashboard Statistics**
   - Total visitors
   - Visitors today
   - Visitors this month

2. **College Distribution**
   - View breakdown of visitors by college
   - See percentage distribution
   - Visual progress bars

3. **All Visitor Logs**
   - Browse complete visitor log history
   - Filter by date, college, or reason

## API Endpoints

### Authentication
- `POST /auth/google-login` - Login or register user
- `POST /auth/logout` - Logout user

### Visitor Logs
- `POST /logs` - Create new visitor log (requires auth)
- `GET /logs/my-logs` - Get user's visit logs (requires auth)

### Admin Routes
- `GET /admin/stats` - Get statistics (admin only)
- `GET /admin/logs` - Get all visitor logs (admin only)
- `GET /admin/logs-by-college` - Get logs grouped by college (admin only)

## Troubleshooting

### Backend won't start
- Check if port 5000 is in use: `netstat -ano | findstr :5000`
- Kill the process: `taskkill /PID <PID> /F`
- Ensure MongoDB is running

### Frontend won't connect to backend
- Check if backend is running on [http://localhost:5000](https://neu-library-visitor-logbook-backend.onrender.com)
- Check browser console for CORS errors
- Verify environment variables in backend

### MongoDB connection error
- If using local MongoDB:
  - Ensure MongoDB service is running
  - Check connection string in `.env`
- If using MongoDB Atlas:
  - Verify IP whitelist in Atlas
  - Check connection string accuracy
  - Ensure network is accessible

### Forms not submitting
- Check browser console for errors
- Verify backend is running
- Check Network tab in Developer Tools

## Deployment

### Deploy Backend (using Render)

1. Create account on platform
2. Connect GitHub repository
3. Set environment variables (MONGO_URI, JWT_SECRET)
4. Deploy

### Deploy Frontend (using Vercel)

1. Update API endpoint in `App.jsx`:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
   ```
2. Deploy to Vercel
3. Set environment variables

## Technologies Used

**Frontend:**
- React 19.2.4
- Axios (HTTP client)
- Vite (Build tool)
- CSS3 (Styling)

**Backend:**
- Express.js
- MongoDB with Mongoose
- JWT (Authentication)
- CORS

## Security Notes

⚠️ This is a development version. For production:

1. Change `JWT_SECRET` to a strong random string
2. Enable HTTPS
3. Implement rate limiting
4. Add data validation on backend
5. Use environment variables properly
6. Enable MongoDB authentication
7. Add CSRF protection
8. Implement proper logging

## Support & Troubleshooting

If you encounter issues:

1. Check console for error messages
2. Verify all services are running
3. Clear browser cache and cookies
4. Restart both frontend and backend servers
5. Check database connection

## Project Information

- **Course**: IM2 (Information Management 2)
- **Institution**: New Era University
- **Purpose**: Library Visitor Management System
- **Created**: 2026

---

**Happy coding! 🚀**
