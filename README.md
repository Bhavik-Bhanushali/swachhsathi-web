# 🧼 Swachhsathi - Web Dashboard

## Overview

**Swachhsathi Web** is the administrative web dashboard for the Swachhsathi Smart Garbage Reporting System. This platform enables municipal administrators and NGOs to efficiently manage waste management operations, assign tasks to field workers, and monitor cleanup progress in real-time.

---

## 🎯 Purpose

The web dashboard serves as the central command center for:
- Managing garbage reports from citizens
- Assigning cleanup tasks to field workers
- Monitoring worker performance and task completion
- Creating and managing worker profiles
- Real-time tracking of cleanup operations
- Analyzing waste management statistics

---

## 🚀 Features

### 👥 User Management
- **Authentication** - Secure Firebase Authentication
- **Role-Based Access** - Admin and NGO user roles
- **Profile Management** - User profile with role information

### 📊 Dashboard
- **Reports Overview** - View all garbage reports with status
- **Task Assignment** - Assign reports to available workers
- **Real-Time Updates** - Live status updates via Firebase
- **Filter & Search** - Find reports by status, location, or worker

### 🛠️ Worker Management
- **Create Workers** - Add new field workers to the system
- **Worker List** - View and manage all registered workers
- **Task Tracking** - Monitor assigned tasks per worker
- **Performance Metrics** - Track completion rates and efficiency

### 🗺️ Location Features
- **Google Maps Integration** - Visual representation of report locations
- **GPS Coordinates** - Precise location tracking for each report
- **Route Planning** - Optimize worker routes for efficiency

### 📋 Task Management
- **Assigned Tasks View** - Track all assigned cleanup tasks
- **Status Updates** - Monitor progress (Pending, Assigned, In Progress, Completed)
- **Before/After Photos** - Document cleanup work with images
- **Timeline Tracking** - Full history of task lifecycle

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18.3
- **Build Tool**: Vite 5.3 (Fast, modern build system)
- **Language**: JavaScript (JSX)
- **Routing**: React Router DOM 7.12
- **State Management**: React Query (TanStack Query 5.90)
- **UI Framework**: Custom CSS with responsive design
- **Maps**: Google Maps API via @react-google-maps/api

### **Backend Services**
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore (Real-time NoSQL database)
- **Storage**: Firebase Storage (Image uploads)
- **Hosting**: Firebase Hosting (Production deployment)

### **Development Tools**
- **Package Manager**: npm
- **Code Quality**: ESLint with React plugins
- **Version Control**: Git
- **Hot Module Replacement**: Vite HMR for instant updates

---

## 📂 Project Structure

```
swachhsathi-web/
├── public/                       # Static assets
├── src/
│   ├── assets/                   # Images and media files
│   │   ├── appimages/            # Application screenshots
│   │   └── images/               # UI images
│   ├── components/               # Reusable React components
│   │   ├── CreateWorkerForm.jsx  # Worker creation form
│   │   ├── GoogleMaps.jsx        # Map component
│   │   ├── Navbar.jsx            # Top navigation bar
│   │   └── Sidebar.jsx           # Side navigation menu
│   ├── context/                  # React Context providers
│   │   └── AuthContext.jsx       # Authentication state
│   ├── pages/                    # Page components
│   │   ├── AssignedTasks.jsx     # Task management page
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── LandingPage.jsx       # Public homepage
│   │   ├── SignInPage.jsx        # Login page
│   │   ├── SignUpPage.jsx        # Registration page
│   │   └── WorkerListPage.jsx    # Worker management
│   ├── routes/                   # Route protection
│   │   ├── ProtectedRoute.jsx    # Auth-required routes
│   │   └── PublicRoute.jsx       # Public routes
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Global styles
├── firebase/                     # Firebase configuration
│   ├── config.js                 # Firebase initialization
│   ├── hooks/                    # Custom Firebase hooks
│   │   ├── useAuth.js            # Authentication hook
│   │   ├── useNGO.js             # NGO operations
│   │   ├── useUsers.js           # User management
│   │   └── useWorker.js          # Worker operations
│   └── services/                 # Firebase service layer
│       ├── AuthService.js        # Auth operations
│       ├── NGOService.js         # NGO CRUD
│       ├── UserService.js        # User CRUD
│       └── WorkerService.js      # Worker CRUD
├── index.html                    # HTML entry point
├── package.json                  # Dependencies
├── vite.config.js                # Vite configuration
├── theme.ts                      # Theme configuration
└── README.md                     # This file
```

---

## 🚦 Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- npm (v8 or higher)
- Firebase account
- Google Maps API key

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd swachhsathi-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Firebase Storage
   - Copy your Firebase config to `firebase/config.js`

4. **Set up Google Maps**
   - Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps JavaScript API
   - Add the API key to your environment

5. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser

### **Build for Production**
```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 🔐 User Roles

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **Admin** | Full access | Manage all reports, workers, and users |
| **NGO** | Organization access | Manage workers, assign tasks, view reports |
| **Worker** | Mobile app only | View and complete assigned tasks |

---

## 📊 Key Features in Detail

### Dashboard
- Real-time report feed with status indicators
- Quick statistics: Total Reports, Assigned, Completed
- Interactive map showing report locations
- Filter by status (Pending, Assigned, In Progress, Completed)

### Worker Management
- Create new worker profiles with contact information
- Assign workers to specific zones or areas
- Track active and completed task counts
- Monitor worker availability

### Task Assignment
- View unassigned reports on the dashboard
- Assign reports to available workers
- Bulk assignment capabilities
- Automatic notification to workers

### Assigned Tasks View
- Comprehensive list of all assigned tasks
- Status tracking with timestamps
- Before/After photo comparisons
- Task history and completion metrics

---

## 🔄 Data Flow

1. **Report Creation** (Mobile App)
   - Citizen captures photo and submits report
   - GPS location automatically tagged
   - Report stored in Firestore

2. **Task Assignment** (Web Dashboard)
   - Admin views pending reports
   - Assigns report to available worker
   - Worker receives notification

3. **Task Completion** (Mobile App)
   - Worker navigates to location
   - Updates status to "In Progress"
   - Uploads completion photo
   - Marks task as completed

4. **Verification** (Web Dashboard)
   - Admin reviews completion
   - Verifies before/after photos
   - Closes the report

---

## 🎨 Design Principles

- **Responsive Design** - Works on desktop, tablet, and mobile browsers
- **User-Friendly Interface** - Clean, intuitive navigation
- **Real-Time Updates** - Live data sync with Firebase
- **Performance Optimized** - Fast loading with Vite
- **Accessibility** - WCAG compliant interface
- **Modern UI** - Contemporary design with smooth animations

---

## 🔮 Future Enhancements

- **Analytics Dashboard** - Charts and graphs for insights
- **Route Optimization** - AI-powered worker route planning
- **Bulk Operations** - Assign multiple tasks at once
- **Export Reports** - Download data as CSV/PDF
- **Push Notifications** - Browser notifications for updates
- **Multi-Language Support** - Localization for different regions
- **Dark Mode** - Theme switching capability
- **Advanced Filters** - More granular search options

---

## 🧪 Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify Firebase config in `firebase/config.js`
- Check Firebase project settings
- Ensure Firestore rules allow read/write

### Maps Not Loading
- Verify Google Maps API key
- Check API key restrictions
- Ensure Maps JavaScript API is enabled

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version: `node --version`

---

## 📄 License

This project was built for a hackathon and is intended for educational and civic purposes.

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

---

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Check the PROJECT_OVERVIEW.md for system architecture
- Review Firebase documentation for backend issues

---

## 🤝 Related Projects

- **Swachhsathi Mobile** - React Native mobile app for citizens and workers
- **Swachhsathi Admin** - Advanced analytics and reporting platform

---

**Built with ❤️ for cleaner, smarter cities**
