# 🧼 Swachhsathi - Smart Garbage Reporting System

## Project Overview

**Swachhsathi** is a comprehensive civic-tech mobile application designed to revolutionize urban waste management through citizen participation and real-time tracking. The app connects three key stakeholders - citizens, municipal workers, and administrators - in a seamless ecosystem for efficient garbage reporting and resolution.

---

## 🎯 Problem Statement

Urban areas face challenges in maintaining cleanliness due to:
- Delayed reporting of garbage accumulation
- Lack of real-time tracking and accountability
- Inefficient communication between citizens and municipal authorities
- Poor visibility of cleanup operations

Swachhsathi addresses these issues by providing a smart, mobile-first platform for instant reporting, tracking, and resolution of waste management concerns.

---

## 🏗️ Architecture

### **Multi-App System**

The project consists of **three interconnected mobile applications**:

1. **👥 Citizen App** - For reporting garbage issues
2. **🛠️ Worker App** - For field workers to manage assigned tasks
3. **🏛️ Admin App** - For municipal administrators to oversee operations

All apps share a common codebase with role-based routing and feature access.

---

## 🚀 Key Features

### 📱 Citizen App
- **Photo Upload** - Capture and upload garbage images
- **GPS Auto-Detection** - Automatic location tagging
- **Report Submission** - Submit detailed complaints to municipality
- **Status Tracking** - Real-time timeline view of report progress
- **Push Notifications** - Updates on assignment and completion
- **Nearby Reports** - View garbage hotspots in your area
- **Multi-Language Support** - Accessibility for diverse users

### 🔧 Worker App
- **Task Management** - View assigned cleanup tasks
- **Location Navigation** - GPS-guided route to report location
- **Progress Updates** - Real-time status updates (In Progress, Completed)
- **Before/After Photos** - Document cleanup work
- **Task Completion** - Mark jobs as done with proof

### 🎛️ Admin App
- **Dashboard** - Overview of all complaints and statistics
- **Advanced Filtering** - By status (Pending/Assigned/Completed/Urgent)
- **Task Assignment** - Assign reports to available workers
- **Worker Management** - Monitor field team performance
- **Analytics Dashboard**:
  - Reports by category
  - Zone-wise distribution
  - Hotspot identification
  - Daily/Weekly trends
  - Response time metrics

---

## 🛠️ Technology Stack

### **Frontend (Mobile)**
- **Framework**: React Native with Expo (~54.0)
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **State Management**: MobX (Observable state)
- **Data Fetching**: TanStack React Query v5
  - Server state caching
  - Background sync
  - Offline support
  - Optimistic updates
- **UI Components**: React Native built-in + Expo components
- **Maps**: React Native Maps with Google Maps integration
- **Camera**: Expo Camera & Image Picker
- **Location**: Expo Location
- **Notifications**: Expo Notifications + Firebase Cloud Messaging

### **Backend**
- **Authentication**: Firebase Authentication (Phone OTP)
- **Database**: Cloud Firestore
  - Real-time updates
  - Offline persistence
  - Security rules
- **Storage**: Firebase Storage (Images)
- **Cloud Functions**: Firebase Functions (Node.js)
  - Analytics aggregation
  - Notification triggers
  - Report assignment logic
- **Push Notifications**: Firebase Cloud Messaging (FCM)

### **DevOps & Tools**
- **Version Control**: Git
- **Package Manager**: npm/yarn
- **Build Tool**: Expo EAS Build
- **Code Quality**: ESLint, TypeScript strict mode

---

## 📂 Project Structure

```
swachhsathi/
├── app/                          # Main app directory (Expo Router)
│   ├── (admin)/                  # Admin role screens
│   ├── (auth)/                   # Authentication screens
│   ├── (user)/                   # Citizen user screens
│   ├── (worker)/                 # Worker role screens
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point
├── assets/                       # Images, fonts, static files
│   └── images/
├── components/                   # Reusable React components
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/                       # UI library components
├── constants/                    # App constants and theme
│   └── theme.ts
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts
│   ├── use-theme-color.ts
│   └── use-color-scheme.web.ts
├── android/                      # Android native code
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/
│   │       └── main/
│   │           ├── AndroidManifest.xml
│   │           ├── java/com/manthant/swachhsathi/
│   │           └── res/
│   ├── build.gradle
│   ├── gradle.properties
│   └── settings.gradle
├── scripts/                      # Utility scripts
│   └── reset-project.js
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── eslint.config.js              # ESLint rules
├── google-services.json          # Firebase config
└── README.md                     # Project documentation
```

---

## 🔐 User Roles & Permissions

| Role | Access | Key Permissions |
|------|--------|----------------|
| **Citizen** | Public users | Create reports, view own reports, track status |
| **Worker** | Municipal field staff | View assigned tasks, update status, upload completion photos |
| **Admin** | Municipal officers | View all reports, assign tasks, manage workers, access analytics |

---

## 🔄 Data Flow

1. **Report Creation**
   - Citizen captures photo → GPS location auto-tagged → Report submitted to Firestore
   
2. **Assignment**
   - Admin views pending reports → Assigns to worker → Worker receives notification
   
3. **Completion**
   - Worker completes task → Uploads after-photo → Status updated → Citizen notified

4. **Analytics**
   - Cloud Functions aggregate data → Generate insights → Display on admin dashboard

---

## 🌐 Firebase Integration

### **Collections Structure**

```
/users/{userId}
  - role: "citizen" | "worker" | "admin"
  - name, phone, createdAt

/reports/{reportId}
  - citizenId, location (GeoPoint), category
  - status: "pending" | "assigned" | "in_progress" | "completed"
  - images: [before_url]
  - assignedTo, completedAt
  - createdAt, updatedAt

/workers/{workerId}
  - assignedReports: [reportIds]
  - activeTasksCount
  - completedTasksCount

/analytics/{date}
  - totalReports, completedReports
  - categoryBreakdown
  - zoneHotspots
```

---

## 📊 Key Metrics & Analytics

- **Response Time**: Time between report creation and assignment
- **Resolution Time**: Time from assignment to completion
- **Hotspot Detection**: Areas with highest report density
- **Worker Performance**: Tasks completed, average resolution time
- **Category Trends**: Most common garbage types
- **Zone Coverage**: Reports by geographical area

---

## 🚦 Getting Started

### **Prerequisites**
- Node.js (v18+)
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Expo CLI
- Firebase account

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd swachhsathi

# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### **Environment Setup**

1. **Firebase Configuration**
   - Create Firebase project
   - Enable Authentication (Phone)
   - Set up Firestore database
   - Configure Firebase Storage
   - Download `google-services.json` for Android
   - Place in project root

2. **Google Maps API**
   - Enable Google Maps Android API
   - Add API key to `app.json`

3. **Android Setup**
   - Install Android SDK
   - Set `ANDROID_HOME` environment variable
   - Accept SDK licenses

---

## 🎨 Design Principles

- **Mobile-First**: Optimized for smartphones
- **Offline-Ready**: Works without internet, syncs when online
- **User-Friendly**: Simple, intuitive UI for all literacy levels
- **Real-Time**: Instant updates via Firebase
- **Accessible**: Multi-language support, high contrast themes
- **Performance**: Optimized images, lazy loading, efficient queries

---

## 🔮 Future Enhancements

- **AI-Powered**: Auto-categorization of garbage types using image recognition
- **Gamification**: Reward points for active citizens
- **Community Leaderboards**: Encourage civic participation
- **Voice Reports**: Voice-to-text reporting for accessibility
- **Route Optimization**: Smart assignment based on worker location
- **Public Dashboard**: Transparency portal for citizens
- **IoT Integration**: Smart bin sensors for automated alerts

---

## 📄 License

This project was built for a hackathon and is intended for educational and civic purposes.

---

## 👥 Team

Developed during a hackathon to solve urban waste management challenges through technology.

---

## 🤝 Contributing

Contributions are welcome! Please follow the standard fork-and-pull-request workflow.

---

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for a cleaner, smarter city**
