# Online Assessment Platform - Frontend

A comprehensive frontend application for an online assessment platform that supports multiple user roles (Students, Admins, and Proctors) with features including exam management, real-time proctoring, automated and manual grading, and detailed analytics.

## Features

### Student Features
- User authentication (registration, login, email verification, password reset)
- Browse and enroll in available exams
- Take exams with a user-friendly interface
- View exam results and performance trends
- Access personal dashboard and profile management

### Admin Features
- Complete exam management (create, edit, manage exams)
- Question bank management (create and organize questions)
- User management (manage students, proctors, and admins)
- Proctoring system configuration and assignment
- Manual grading for subjective questions
- Comprehensive analytics and reporting
- View pending grading tasks

### Proctor Features
- Monitor live exam sessions
- View flagged exams for suspicious activity
- Access detailed activity logs
- Real-time video proctoring capabilities

## Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.11.0
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.13.2
- **Notifications**: React Toastify 11.0.5
- **Language**: JavaScript (ES6+)

## Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager
- Backend API server running (configured at `https://online-assessment-platform-backend-kirc.onrender.com/api`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Online-Assessment-Platform-Frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will start on `http://localhost:5173` (default Vite port)

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Project Structure

```
src/
├── Components/
│   ├── Layout.jsx          # Main layout component
│   ├── Navbar.jsx          # Navigation bar
│   ├── Sidebar.jsx         # Sidebar navigation
│   ├── ProtectedRoute.jsx  # Route protection based on roles
│   └── VideoProctor.jsx    # Video proctoring component
├── Context/
│   └── AuthContext.jsx     # Authentication context provider
├── Pages/
│   ├── Home.jsx            # Landing page
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── VerifyEmail.jsx     # Email verification
│   ├── ForgotPassword.jsx  # Password recovery
│   ├── ResetPassword.jsx   # Password reset
│   ├── Unauthorized.jsx    # Unauthorized access page
│   ├── StudentDashboard.jsx
│   ├── AvailableExams.jsx
│   ├── MyExams.jsx
│   ├── TakeExam.jsx
│   ├── ExamInstructions.jsx
│   ├── Results.jsx
│   ├── PerformanceTrends.jsx
│   ├── Profile.jsx
│   ├── Admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageExams.jsx
│   │   ├── CreateExam.jsx
│   │   ├── QuestionBank.jsx
│   │   ├── CreateQuestion.jsx
│   │   ├── ManageUsers.jsx
│   │   ├── Proctoring.jsx
│   │   ├── ProctorAssignment.jsx
│   │   ├── PendingGrading.jsx
│   │   ├── ManualGrading.jsx
│   │   └── Analytics.jsx
│   └── Proctor/
│       ├── ProctorDashboard.jsx
│       ├── LiveSessions.jsx
│       ├── FlaggedExams.jsx
│       └── ActivityLogs.jsx
├── Services/
│   └── api.js              # Axios instance with interceptors
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Application entry point
├── App.css                  # Global app styles
└── index.css                # Base styles
```

## Configuration

### API Configuration
The API base URL is configured in `src/Services/api.js`. Update the `baseURL` if you need to point to a different backend server.

### Environment Variables
Create a `.env` file in the root directory for environment-specific configurations:
```
VITE_API_BASE_URL=your-api-url-here
```

## Authentication & Authorization

The application uses JWT tokens stored in localStorage for authentication. Protected routes are implemented using the `ProtectedRoute` component, which checks user roles:
- `student`: Access to student dashboard and exam features
- `admin`: Access to admin panel and all management features
- `proctor`: Access to proctoring dashboard and monitoring features

## Key Features Implementation

### Protected Routes
Routes are protected based on user roles. Unauthorized users are redirected to the login page or unauthorized page.

### API Interceptors
- Request interceptor: Automatically adds JWT token to all API requests
- Response interceptor: Handles 401 errors by clearing tokens and redirecting to login

### Toast Notifications
React Toastify is configured for user feedback throughout the application.

## Deployment

The project includes a `vercel.json` configuration file for deployment on Vercel. For other platforms, ensure:
1. Build the project: `npm run build`
2. Serve the `dist` folder generated by Vite
3. Configure environment variables on your hosting platform

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Commit your changes with clear messages
5. Push to your branch and create a pull request


