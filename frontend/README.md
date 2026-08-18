💼 Job Portal

Where Skills Meet Opportunities – Connecting Talent with the Right Career Path

A full-stack Job Portal web application designed to connect job seekers with employers through a simple and user-friendly platform.

🚀 Features

👨‍💻 Job Seeker

- User registration and login
- Browse available jobs
- Search for jobs
- View job details
- Apply for jobs
- Bookmark jobs
- Job seeker dashboard
- Role-based dashboard access

🏢 Employer

- Employer registration and login
- Employer dashboard
- Post job opportunities
- Manage posted jobs
- View job applications
- Role-based access

🔐 Authentication & Security

- User authentication
- Role-based access control
- Protected dashboards
- Environment variables for sensitive configuration

🛠️ Technologies Used

Frontend

- HTML5
- CSS3
- JavaScript

Backend

- Node.js
- Express.js

Database

- MongoDB
- Mongoose

Development Tools

- Visual Studio Code
- Git & GitHub
- MongoDB Atlas

📁 Project Structure

Job-Portal/
│
├── frontend/
│   ├── home.html
│   ├── css/
│   └── js/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── middleware/
│
├── .gitignore
├── README.md
└── package.json

«The exact structure may vary depending on the current version of the project.»

⚙️ Installation & Setup

1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL

2. Open the project

cd Job-Portal

3. Install backend dependencies

cd backend
npm install

4. Create a ".env" file

Inside the backend folder, create:

.env

Add your MongoDB connection string:

MONGODB_URI=your_mongodb_connection_string
PORT=5000

⚠️ Never upload your ".env" file to GitHub.

5. Start the server

node server.js

Or, if your project has a development script:

npm run dev

The backend will run on:

"https://job-portal-1-5gno.onrender.com/api/jobs"

🔑 User Roles

The application supports different user roles:

Role| Main Functions
👨‍💻 Job Seeker| Search, bookmark and apply for jobs
🏢 Employer| Post and manage jobs and applications

🌐 Database

The project uses MongoDB to store application data such as:

- User accounts
- Jobs
- Applications
- Bookmarks
- Employer information

MongoDB Atlas can be used for cloud database hosting.

🔒 Environment Variables

Sensitive information should be stored in ".env" rather than directly in the source code.

Example:

MONGODB_URI=your_connection_string
PORT=5000

The ".env" file is excluded from Git using ".gitignore".


🔮 Future Improvements

Possible future improvements include:

- Resume upload
- Advanced job filtering
- Email notifications
- Application status tracking
- Admin dashboard
- Employer verification
- Profile management
- Responsive mobile design
- Online deployment

👨‍💻 Author

Sandeep Jogi

Computer Science & Engineering

⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

Made with ❤️ using HTML, CSS, JavaScript, Node.js, Express.js and MongoDB.