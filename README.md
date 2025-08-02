# CivicTrack

CivicTrack is a web application designed to enable citizens to report civic issues, file complaints, and track their status.

## Features

- **User Authentication:** Register and log in using email and password.
- **Report Submission:** Authenticated users can submit reports with titles, descriptions, categories, locations (latitude/longitude), and photos.
- **Complaint Filing:** Users can file complaints linked to departments and citizens.
- **Report Listing:** View reports within a specified radius, with photo display.
- **Admin Dashboard:** Admins can update report statuses and view analytics.
- **Protected Routes:** Restrict access to certain routes for authenticated users or admins.
- **Responsive Design:** Mobile-friendly UI with Tailwind CSS or custom styles.
- **Photo Storage:** Photos are stored in MySQL as LONGBLOB with validation for JPEG/PNG/GIF formats and a 5MB size limit.

## Tech Stack

- **Frontend:** React 18, React Router 6, Axios, Tailwind CSS, Context API
- **Backend:** Node.js, Express, MySQL, JWT, Multer
- **Database:** MySQL with InnoDB engine
- **Other:** Winston, bcrypt, express-validator

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CivicTrack
```

### 2. Backend Setup

Navigate to Backend Directory:
```bash
cd backend
```

Install Dependencies:
```bash
npm install
```

Configure Environment Variables:

Create a .env file in /backend with the following:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=civictrack
PORT=3000
JWT_SECRET=your_jwt_secret
```

Replace your_mysql_username, your_mysql_password, and your_jwt_secret with your MySQL credentials and a secure JWT secret.

Set Up MySQL Database:

Ensure MySQL is running.
Create the civictrack database:
```sql
CREATE DATABASE civictrack;
```

Run the migration script to create tables:
```bash
mysql -u your_mysql_username -p civictrack < migrations/20250802_init.sql
```

Enter your MySQL password when prompted.

Start the Backend:
```bash
npm start
```

The backend will run on http://localhost:3000.

### 3. Frontend Setup

Navigate to Frontend Directory:
```bash
cd ../frontend
```

Install Dependencies:
```bash
npm install
```

Configure Environment Variables:

Create a .env file in /frontend with:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

This points the frontend to the backend API.

Start the Frontend:
```bash
npm start
```

The frontend will run on http://localhost:3000.

### 4. Database Setup

The 20250802_init.sql script creates the following tables:
citizens, departments, officers, complaints, users, categories, reports, photos, status_logs, flags.

It also inserts initial data for categories and departments.
Verify the database setup:
```bash
mysql -u your_mysql_username -p
USE civictrack;
SHOW TABLES;
```

## Running the Application

### Start the Backend:

In /backend:
```bash
npm start
```

Ensure http://localhost:3000/api is accessible (e.g., curl http://localhost:3000/api/auth/verify with a valid token).

### Start the Frontend:

In /frontend:
```bash
npm start
```

Open http://localhost:3000 in a browser.

### Test the Application:

- Register: Go to /signup, create a user (e.g., email: test@example.com, password: password123).
- Login: Go to /login, use the registered credentials.
- Submit Report: Navigate to /report, submit a report with a photo (JPEG/PNG/GIF, <5MB).
- View Reports: Go to /reports, search by latitude/longitude to view reports with photos.
- Admin Access: Log in with an admin user (set is_admin = TRUE in the users table), then visit /admin.
- Verify Photos: Check the photos table in MySQL:
```sql
SELECT photo_id, report_id, mimetype, filename, LENGTH(data) AS size FROM photos;
```

## API Endpoints

- Auth:
  - POST /api/auth/register: Register a new user ({ username, email, password, isAdmin }).
  - POST /api/auth/login: Log in ({ email, password }).
  - GET /api/auth/verify: Verify JWT token (requires Authorization: Bearer <token>).

- Reports:
  - POST /api/reports: Create a report with photos (multipart/form-data).
  - GET /api/reports: Get reports within a radius.
  - PUT /api/reports/:reportId/status: Update report status (admin only).

- Photos:
  - GET /api/photos/:photoId/data: Fetch photo data as binary.

- Others: Endpoints for categories, citizens, departments, officers, complaints, and admin analytics (see respective routes).

## Troubleshooting

### Backend Errors:

- Ensure MySQL is running and credentials in .env are correct.
- Check logs in /backend/logs for errors.
- Verify JWT token with:
```bash
curl -H "Authorization: Bearer <your_token>" http://localhost:3000/api/auth/verify
```

### Frontend Errors:

- Clear Webpack cache:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

- Check browser console (F12) for errors.

### Login Issues:

- Ensure a user exists in the users table:
```sql
INSERT INTO users (username, email, password_hash, is_admin)
VALUES ('testuser', 'test@example.com', '$2a$10$example_hash', FALSE);
```

- Use bcrypt to generate password_hash or register via /signup.

### Photo Issues:

- Verify photos are stored in the photos table.
- Ensure /api/photos/:photoId/data returns binary data.

## Development Notes

- Photo Storage: Photos are stored as LONGBLOB in MySQL. Limit uploads to 5MB and 35 photos per report for performance.
- Security: JWT tokens expire after 1 hour. Refresh logic can be added if needed.
- Scalability: MySQL BLOB storage is suitable for small-to-medium applications. For larger scale, consider a dedicated file storage solution.
- Future Improvements:
  - Add MapView.js with react-leaflet for interactive maps.
  - Implement password reset and email notifications.
  - Add unit tests with Jest for frontend and Mocha for backend.

## License

MIT License. See LICENSE file for details (if applicable).