# civic-track
CivicTrack Backend
Welcome to the CivicTrack Backend, a robust Node.js/Express.js application designed to manage civic issue reporting, tracking, and administration. This backend supports a platform where users can report issues (e.g., potholes, lighting issues), citizens can lodge complaints, and administrators can monitor and resolve them. It integrates with a MySQL database and includes features like user authentication, geospatial filtering, and photo uploads.
Table of Contents

Overview
Features
Prerequisites
Setup
API Endpoints
Database Schema
Environment Variables
Running the Application
Testing
Contributing
License
Contact

Overview
The CivicTrack Backend is built using modern web technologies and follows best practices for security, modularity, and performance. It serves as the server-side component for the CivicTrack platform, handling RESTful API requests and managing data persistence in a MySQL database.

Framework: Express.js
Database: MySQL
Authentication: JWT (JSON Web Tokens)
Dependencies: Managed via package.json
Version: 1.0.0

Features

User registration and authentication with admin privileges.
Reporting civic issues with geospatial coordinates and photos.
Citizen complaint submission linked to departments and officers.
Status tracking for reports and complaints.
Administrative tools for flagging reports and viewing analytics.
Secure API endpoints with input validation and error handling.
Geospatial querying for nearby issues.

Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js: v18.x or later (https://nodejs.org/)
npm: v9.x or later (comes with Node.js)
MySQL: v8.0 or later (https://www.mysql.com/)
Git: For version control (https://git-scm.com/)
AWS SDK: Optional, for S3 photo uploads (configure credentials)

Setup
Follow these steps to set up the CivicTrack Backend locally:

Clone the Repository:
git clone https://github.com/your-username/CivicTrack.git
cd CIVIC AI


Install Dependencies:Navigate to the backend directory and install the required packages:
cd backend
npm install


Configure the Database:

Ensure MySQL is running on your local machine.
Create the civictrack database:mysql -u your_username -p
CREATE DATABASE IF NOT EXISTS civictrack;
EXIT;


Apply the database schema:mysql -u your_username -p civictrack < migrations/20250802_init.sql




Create Environment Variables:

Copy the .env.example file (or create .env manually) in the backend directory with the following content:DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=civictrack
PORT=3000
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET=your_s3_bucket


Replace placeholders (e.g., your_username, your_password) with your actual values.
Note: The .env file is ignored by Git for security reasons.


Run the Application:See the Running the Application section.


API Endpoints
The backend exposes the following RESTful endpoints:
Authentication

POST /api/auth/register
Body: { "username": "string", "email": "string", "password": "string" }
Response: { "message": "User registered successfully" }


POST /api/auth/login
Body: { "email": "string", "password": "string" }
Response: { "token": "jwt_token" }



Reports

POST /api/reports
Headers: Authorization: Bearer your_jwt_token
Body: { "title": "string", "description": "string", "categoryId": number, "latitude": number, "longitude": number }
Response: { "reportId": number, "token": "string|null" }


GET /api/reports
Query: ?latitude=number&longitude=number&radius=number&status=string&categoryId=number
Response: [{ "reportId": number, "title": "string", ... }]



Categories

GET /api/categories
Response: [{ "category_id": number, "name": "string" }]



Citizens

POST /api/citizens
Body: { "name": "string", "phone": "string", "email": "string", "address": "string", "aadhar_no": "string" }
Response: { "citizenId": number }


GET /api/citizens
Headers: Authorization: Bearer your_jwt_token (admin only)
Response: [{ "citizen_id": number, "name": "string", ... }]



Departments

POST /api/departments
Headers: Authorization: Bearer your_jwt_token (admin only)
Body: { "dept_name": "string", "contact_no": "string" }
Response: { "deptId": number }


GET /api/departments
Response: [{ "dept_id": number, "dept_name": "string", ... }]



Officers

POST /api/officers
Headers: Authorization: Bearer your_jwt_token (admin only)
Body: { "name": "string", "designation": "string", "phone": "string", "email": "string", "dept_id": number }
Response: { "officerId": number }


GET /api/officers
Headers: Authorization: Bearer your_jwt_token (admin only)
Response: [{ "officer_id": number, "name": "string", ... }]



Complaints

POST /api/complaints
Body: { "citizen_id": number, "dept_id": number, "description": "string" }
Response: { "complaintId": number }


PUT /api/complaints/:complaintId/status
Headers: Authorization: Bearer your_jwt_token (admin only)
Body: { "status": "Pending|In Progress|Resolved" }
Response: { "message": "Complaint status updated" }


GET /api/complaints
Headers: Authorization: Bearer your_jwt_token (admin only)
Query: ?status=string&dept_id=number
Response: [{ "complaint_id": number, "description": "string", ... }]



Admin

GET /api/admin/flagged
Headers: Authorization: Bearer your_jwt_token (admin only)
Response: [{ "report_id": number, "title": "string", "flag_count": number }]


PUT /api/admin/users/:userId/ban
Headers: Authorization: Bearer your_jwt_token (admin only)
Response: { "message": "User banned" }


GET /api/admin/analytics
Headers: Authorization: Bearer your_jwt_token (admin only)
Response: { "totalReports": number, "totalComplaints": number, "categoryStats": [...], "deptStats": [...] }



Database Schema
The backend uses a MySQL database with the following tables:

users: Stores registered users with authentication details.
categories: Lists issue categories (e.g., Roads, Lighting).
reports: Tracks user-submitted issues with geospatial data.
photos: Stores photo URLs linked to reports.
status_logs: Logs status changes for reports.
flags: Records flagged reports for moderation.
citizens: Stores details of citizens submitting complaints.
departments: Manages departments handling complaints.
officers: Tracks officers assigned to departments.
complaints: Records citizen-submitted complaints.

The schema is defined in migrations/20250802_init.sql and includes indexes (e.g., spatial index on reports.location) for performance.
Environment Variables
Configure the following variables in a .env file in the backend directory:

DB_HOST: MySQL host (default: localhost)
DB_USER: MySQL username
DB_PASSWORD: MySQL password
DB_NAME: Database name (default: civictrack)
PORT: Server port (default: 3000)
JWT_SECRET: Secret key for JWT (e.g., a random string)
AWS_ACCESS_KEY_ID: AWS access key for S3 (optional)
AWS_SECRET_ACCESS_KEY: AWS secret key for S3 (optional)
AWS_REGION: AWS region for S3 (optional)
S3_BUCKET: S3 bucket name for photo storage (optional)

Example .env:
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=civictrack
PORT=3000
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET=your_s3_bucket

Running the Application

Start the server in production mode:
cd backend
npm start


The server will run on http://localhost:3000 (or the port specified in .env).


Start the server in development mode with hot-reloading:
cd backend
npm run dev


Verify the server is running by accessing:

http://localhost:3000/api/categories (should return a list of categories).



Testing
The project includes unit and integration tests in the tests directory. To run tests:

Ensure dependencies are installed.
Run the test suite (add a test script to package.json if not present):cd backend
npm test


Note: Currently, no test runner (e.g., Jest) is configured. Add "test": "jest" to scripts and install Jest (npm install --save-dev jest) to enable testing.



Contributing
We welcome contributions to enhance CivicTrack! To contribute:

Fork the repository.
Create a new branch: git checkout -b feature/your-feature.
Make your changes and commit: git commit -m "Add your feature".
Push to the branch: git push origin feature/your-feature.
Open a pull request on GitHub.

Please adhere to the following guidelines:

Follow the existing code style (ES6, JSDoc comments).
Write tests for new features.
Update documentation as needed.

License
This project is currently unlicensed. Add a license (e.g., MIT) by creating a LICENSE file if you intend to open-source it. For now, all rights are reserved by the project owner.
Contact
For questions or support, please open an issue on the GitHub repository or contact the project maintainer:

Email: [devendra99651@gmail.com] 
GitHub: d3va-12
