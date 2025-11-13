# 🎯 Trello Clone - Full-Featured Project Management App

A comprehensive, production-ready Trello clone built with React, featuring real-time collaboration, task management, and team coordination capabilities. Perfect for managing projects, tracking tasks, and collaborating with teams.

![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.10-38B2AC?logo=tailwind-css)
![Material-UI](https://img.shields.io/badge/Material--UI-7.1.1-0081CB?logo=material-ui)

## ✨ Features

### 🎨 Board Management
- **Create & Organize Boards** - Unlimited boards with custom backgrounds
- **Custom Backgrounds** - 8 beautiful presets + custom URL support
- **Board Renaming** - Click-to-edit inline board titles
- **Search Functionality** - Real-time task search across all columns
- **Auto-Sync** - Automatic refresh every 5 seconds for real-time updates

### 📋 Task Management
- **Rich Task Details** - Titles, descriptions, due dates, and status tracking
- **Due Date Management** - Calendar picker with visual due date indicators
- **Color-Coded Labels** - Create custom labels for task categorization
- **Comments System** - Real-time threaded discussions on tasks
- **Drag & Drop** - Intuitive task and column reordering
- **Task Search** - Find tasks quickly by title or description

### 👥 Team Collaboration
- **Member Management** - Invite team members via email
- **Role-Based Permissions** - Owner, Admin, Member, and Viewer roles
- **Pending Invitations** - View and manage board invitations in real-time
- **Member Profiles** - See all board members with avatars and roles
- **Activity Log** - Track all board activities and changes

### 🔐 User Features
- **User Authentication** - Secure login and registration
- **Profile Management** - Personal profile with statistics
- **Password Reset** - Forgot password and reset functionality
- **Account Settings** - Update username, password, or delete account

### 🎯 Advanced Features
- **Activity Timeline** - Complete audit trail of board actions
- **Column Management** - Rename, copy, and delete columns
- **Permission System** - Viewer, Member, Admin, and Owner roles
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Loading States** - Professional loading indicators throughout

## 🚀 Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks
- **React Router 7.6.2** - Client-side routing
- **Vite 6.3.5** - Lightning-fast build tool
- **TailwindCSS 4.1.10** - Utility-first CSS framework
- **Material-UI 7.1.1** - Premium UI components

### Drag & Drop
- **@dnd-kit/core 6.3.1** - Modern drag and drop toolkit
- **@dnd-kit/sortable 10.0.0** - Sortable lists and grids

### HTTP & State
- **Axios 1.10.0** - HTTP client
- **Context API** - Global state management

### Visual Effects
- **Vanta.js 0.5.24** - Animated 3D backgrounds
- **Three.js 0.177.0** - 3D graphics library

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API server running on `http://localhost:3000`

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trello-clone.git
   cd trello-clone/client/my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Ensure backend API is running on `http://localhost:3000`
   - Update API URL in `src/lib/axios.js` if needed

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── assets/           # Images and static assets
├── components/       # React components
│   ├── ui/          # Reusable UI components (Modal, SimpleModal)
│   ├── background/  # Vanta animated backgrounds
│   ├── ActivityLog.jsx
│   ├── BoardCard.jsx
│   ├── Column.jsx
│   ├── CreateBoardForm.jsx
│   ├── CreateColumnForm.jsx
│   ├── CreateTaskForm.jsx
│   ├── EditTaskForm.jsx
│   ├── InviteMemberForm.jsx
│   ├── Navbar.jsx
│   ├── PendingInvitations.jsx
│   └── SortableColumn.jsx
├── context/         # React Context for state management
│   ├── AppContext.jsx
│   ├── AuthContext.jsx
│   └── AuthReducer.jsx
├── hooks/           # Custom React hooks
│   ├── useBoard.js
│   └── useDragHandlers.js
├── layout/          # Layout components
│   └── Layout.jsx
├── lib/             # Library configurations
│   └── axios.js     # Axios configuration
├── pages/           # Page components
│   ├── Board.jsx
│   ├── CreateBoard.jsx
│   ├── ForgotPassword.jsx
│   ├── Home.jsx
│   ├── InvitationPage.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   ├── ResetPassword.jsx
│   └── Settings.jsx
├── services/        # API service functions
│   ├── BoardService.js
│   ├── RegisterationService.js
│   ├── TaskService.js
│   └── UserService.js
├── utils/           # Utility functions
│   └── DragHandlers.js
├── App.jsx          # Main App component
├── main.jsx         # React entry point
└── index.css        # Global styles
```

## 🎮 Usage Guide

### Creating a Board
1. Click **"Create"** button in navbar
2. Enter board name
3. Click **"Create Board"**
4. Start adding columns and tasks

### Managing Tasks
1. Click **3-dot menu** on any column
2. Select **"Create New Task"**
3. Add title, description, due date
4. Click **"Create Task"**
5. Click any task to edit details, add comments, or labels

### Inviting Members
1. Open board settings (⚙️ icon)
2. Scroll to **"Invite New Member"**
3. Enter email and select role
4. Click **"Send Invitation"**

### Changing Board Background
1. Click **Image icon** (🖼️) in board header
2. Choose from 8 beautiful presets
3. Or enter custom URL
4. Background saves automatically

### Viewing Activity
1. Click **History icon** (🕐) in board header
2. Filter by activity type
3. View complete timeline of changes

## 🔑 Permission System

| Permission | Viewer | Member | Admin | Owner |
|-----------|--------|--------|-------|-------|
| View Board | ✅ | ✅ | ✅ | ✅ |
| Create Tasks | ❌ | ✅ | ✅ | ✅ |
| Edit Tasks | ❌ | ✅ | ✅ | ✅ |
| Create Columns | ❌ | ✅ | ✅ | ✅ |
| Rename Board | ❌ | ❌ | ✅ | ✅ |
| Invite Members | ❌ | ❌ | ❌ | ✅ |
| Remove Members | ❌ | ❌ | ❌ | ✅ |
| Delete Board | ❌ | ❌ | ❌ | ✅ |

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🌟 Key Highlights

### Real-Time Collaboration
- Automatic board syncing every 5 seconds
- All team members see changes instantly
- No manual refresh required

### Professional UX
- Loading states throughout the app
- Graceful error handling
- Hover effects and visual feedback
- Smooth animations and transitions

### Enterprise Features
- Complete audit trail with activity log
- Role-based access control
- Task comments and discussions
- Due date tracking with visual indicators

### Responsive Design
- Mobile-friendly interface
- Touch-optimized drag and drop
- Adaptive layouts for all screen sizes

## 🔒 Security Features
- JWT-based authentication
- Protected routes
- Role-based permissions
- Secure password reset flow

## 📝 API Integration

The app expects a backend API with these endpoints:

### Authentication
- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/forgot-password`
- `POST /api/users/reset-password`

### Boards
- `GET /api/boards`
- `POST /api/boards`
- `GET /api/boards/:id`
- `PUT /api/boards/:id`
- `DELETE /api/boards/:id`
- `GET /api/boards/:id/members`
- `POST /api/boards/:id/invite`

### Tasks
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/tasks/:id/comments`
- `POST /api/tasks/:id/comments`

## 🎯 Future Enhancements
- [ ] WebSocket for true real-time updates
- [ ] File attachments on tasks
- [ ] Task templates
- [ ] Board templates
- [ ] Dark mode
- [ ] Export to PDF/CSV
- [ ] Calendar view
- [ ] Gantt chart view
- [ ] Advanced filters
- [ ] Keyboard shortcuts panel

## 🐛 Known Issues
- Activity log currently shows mock data (backend implementation needed)
- Task labels/comments require backend persistence

## 📄 License
MIT License - feel free to use this project for learning or portfolio purposes.

## 👤 Author
**Your Name**
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments
- Inspired by Trello's intuitive design
- Built with modern React best practices
- Uses Material-UI for professional components
- Drag and drop powered by dnd-kit

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Beautiful home dashboard with all your boards*

### Board View
![Board View](./screenshots/board.png)
*Kanban-style board with drag and drop*

### Task Details
![Task Details](./screenshots/task-details.png)
*Rich task details with comments and labels*

### Activity Log
![Activity Log](./screenshots/activity-log.png)
*Complete timeline of board activities*

---

⭐ **Star this repo** if you found it helpful!

🐛 **Report bugs** by opening an issue

💡 **Suggest features** via pull requests

Built with ❤️ using React and modern web technologies
