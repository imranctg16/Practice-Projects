# Task Manager - Full Stack CRUD Application

A minimal, clean, and Dockerized full-stack React + Node.js CRUD application perfect for learning and reverse-engineering.

## 🚀 Quick Start

```bash
# Clone or create the project directory
mkdir task-manager && cd task-manager

# Copy all the files (provided below)
# Then run:
docker-compose up
```

**That's it!** The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
react-node-crud-app/
├── client/                     # React frontend
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.js    # Form component for create/edit
│   │   │   ├── TaskList.js    # List component
│   │   │   └── TaskItem.js    # Individual task component
│   │   ├── App.js             # Main app component
│   │   ├── App.css            # App-specific styles
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   ├── Dockerfile             # Frontend Docker config
│   ├── .dockerignore          # Docker ignore file
│   └── package.json           # Dependencies and scripts
├── server/                     # Express backend
│   ├── server.js              # Main server file
│   ├── Dockerfile             # Backend Docker config
│   ├── .dockerignore          # Docker ignore file
│   └── package.json           # Dependencies and scripts
├── docker-compose.yml         # Docker orchestration
└── README.md                  # This file
```

## 🎯 Features

### Backend (Express.js)
- **RESTful API** with full CRUD operations
- **In-memory storage** (array-based, no database needed)
- **CORS enabled** for frontend communication
- **Error handling** with proper HTTP status codes
- **Input validation** and sanitization
- **JSON responses** with consistent structure

### Frontend (React)
- **Modern React** with hooks (useState, useEffect)
- **Component-based architecture**
- **Real-time UI updates** after API calls
- **Form validation** and error handling
- **Responsive design** with clean CSS
- **Loading states** and user feedback

### DevOps
- **Fully Dockerized** with multi-container setup
- **Development-friendly** with hot reloading
- **Production-ready** container configuration
- **Health checks** and restart policies

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/tasks` | Get all tasks |
| POST   | `/api/tasks` | Create new task |
| PUT    | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET    | `/api/health` | Health check |

### Example API Usage

```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker", "description": "Master containerization"}'

# Update a task
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker", "completed": true}'

# Delete a task
curl -X DELETE http://localhost:5000/api/tasks/1
```

## 🏗️ How It Works

### React ↔ Express Communication Flow

1. **User Interaction**: User clicks "Add Task" button
2. **React Form**: TaskForm component captures input
3. **API Call**: App.js makes POST request to Express
4. **Express Processing**: Server validates, stores in memory
5. **Response**: Server returns success/error JSON
6. **React Update**: App.js updates state, re-renders UI

### Component Architecture

```
App.js (Main container)
├── TaskForm.js (Create/Edit form)
└── TaskList.js (List container)
    └── TaskItem.js (Individual items)
```

### State Management Flow

```javascript
// 1. App.js holds global state
const [tasks, setTasks] = useState([]);

// 2. API functions modify state
const createTask = async (taskData) => {
  const response = await fetch('/api/tasks', {...});
  setTasks(prevTasks => [...prevTasks, newTask]);
};

// 3. Components receive state as props
<TaskList tasks={tasks} onDeleteTask={deleteTask} />
```

## 📚 Learning Guide

### For Backend (Express.js)

**Key Files to Study:**
- `server/server.js` - Main server logic, routing, CRUD operations

**Key Concepts:**
- **Middleware**: `app.use(cors())`, `app.use(express.json())`
- **Routing**: `app.get('/api/tasks', handler)`
- **Error Handling**: Try-catch blocks, HTTP status codes
- **Data Validation**: Input sanitization and validation
- **In-Memory Storage**: Array manipulation for CRUD

**Try This:**
1. Add a new field to tasks (e.g., `priority`)
2. Implement task filtering by completion status
3. Add pagination to the GET endpoint

### For Frontend (React)

**Key Files to Study:**
- `client/src/App.js` - Main application logic and state
- `client/src/components/TaskForm.js` - Form handling
- `client/src/components/TaskList.js` - List rendering
- `client/src/components/TaskItem.js` - Individual item logic

**Key Concepts:**
- **React Hooks**: `useState` for state, `useEffect` for side effects
- **Props**: Parent-child component communication
- **Event Handling**: Form submission, button clicks
- **API Integration**: `fetch()` for HTTP requests
- **State Management**: Lifting state up, prop drilling

**Try This:**
1. Add task search functionality
2. Implement task categories or tags
3. Add task due dates with sorting
4. Create a task counter component

### For Docker

**Key Files to Study:**
- `docker-compose.yml` - Multi-container orchestration
- `client/Dockerfile` - Frontend container setup
- `server/Dockerfile` - Backend container setup

**Key Concepts:**
- **Multi-stage builds**: Optimizing container size
- **Volume mounting**: Development vs production
- **Environment variables**: Configuration management
- **Service networking**: Container communication

## 🔨 Development Commands

```bash
# Start with Docker (recommended)
docker-compose up

# Start with Docker in background
docker-compose up -d

# Stop containers
docker-compose down

# Rebuild containers
docker-compose up --build

# View logs
docker-compose logs -f

# Without Docker (requires Node.js locally)
# Terminal 1 - Backend
cd server && npm install && npm start

# Terminal 2 - Frontend
cd client && npm install && npm start
```

## 🧪 Testing the Application

### Manual Testing Checklist

1. **Create Task**: Add a task with title and description
2. **View Tasks**: Verify tasks appear in the list
3. **Edit Task**: Click edit, modify, and save
4. **Toggle Completion**: Mark tasks as complete/incomplete
5. **Delete Task**: Remove tasks with confirmation
6. **Form Validation**: Try submitting empty forms
7. **Error Handling**: Stop backend, test error states

### API Testing

```bash
# Test all endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/tasks
curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '{"title":"Test"}'
```

## 🎨 Customization Ideas

### Easy Modifications
- Change colors in `client/src/index.css`
- Add new task fields (priority, due date, tags)
- Implement task search/filter functionality
- Add task categories or projects

### Advanced Features
- User authentication with JWT
- Real database integration (MongoDB, PostgreSQL)
- File upload for task attachments
- Real-time updates with WebSockets
- Task sharing between users

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes on ports 3000/5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

**Docker Issues**
```bash
# Clean up Docker
docker-compose down -v
docker system prune -a
```

**Frontend Can't Connect to Backend**
- Check if backend is running on port 5000
- Verify CORS is enabled in server.js
- Check browser console for errors

**Hot Reload Not Working**
- Add `CHOKIDAR_USEPOLLING=true` to docker-compose.yml
- Restart containers with `docker-compose up --build`

## 📖 What You'll Learn

### React Concepts
- Functional components and hooks
- State management with useState
- Side effects with useEffect
- Component composition and props
- Event handling and form submission
- API integration with fetch

### Node.js/Express Concepts
- RESTful API design
- Middleware usage
- Route handling
- Error handling
- CORS configuration
- JSON request/response handling

### Full-Stack Integration
- Frontend-backend communication
- API design and consumption
- State synchronization
- Error handling across layers
- Development workflow

### DevOps Basics
- Docker containerization
- Multi-container applications
- Environment configuration
- Development vs production setups

## 🎓 Next Steps

1. **Add a Database**: Replace in-memory storage with MongoDB or PostgreSQL
2. **Add Authentication**: Implement user registration and login
3. **Deploy to Cloud**: Use AWS, Heroku, or DigitalOcean
4. **Add Tests**: Write unit and integration tests
5. **Implement WebSockets**: Add real-time features
6. **Add State Management**: Use Redux or Context API
7. **Build Production Version**: Optimize for production deployment

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new features
- Improve the UI/UX
- Add tests
- Fix bugs
- Enhance documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Learning!** 🚀

This project is designed to be your stepping stone into full-stack development. Take your time exploring each part, and don't hesitate to break things and experiment!