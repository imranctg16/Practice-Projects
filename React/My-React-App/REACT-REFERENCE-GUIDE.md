# **Complete React Reference Guide**

## **Table of Contents**
1. [React Fundamentals](#1-react-fundamentals)
2. [useState Hook](#2-usestate-hook)
3. [useEffect Hook](#3-useeffect-hook)
4. [Custom Hooks](#4-custom-hooks)
5. [Context API & Providers](#5-context-api--providers)
6. [React Router](#6-react-router)
7. [Performance Optimization](#7-performance-optimization)
8. [useReducer Hook](#8-usereducer-hook)
9. [Redux & Redux Toolkit](#9-redux--redux-toolkit)
10. [Best Practices & Patterns](#10-best-practices--patterns)

---

## **1. React Fundamentals**

### **What is React?**
React is a JavaScript library for building user interfaces, especially web applications. It uses a component-based architecture where UI is broken down into reusable pieces.

### **JSX (JavaScript XML)**
JSX allows you to write HTML-like syntax in JavaScript.

```javascript
// JSX Example
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>; // HTML-like syntax in JS
}

// Without JSX (React.createElement)
function Welcome({ name }) {
  return React.createElement('h1', null, `Hello, ${name}!`);
}
```

### **Components**
Two types: **Function Components** (modern) and **Class Components** (legacy).

```javascript
// Function Component (Preferred)
function UserCard({ user }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// Class Component (Legacy)
class UserCard extends React.Component {
  render() {
    return (
      <div className="user-card">
        <h3>{this.props.user.name}</h3>
        <p>{this.props.user.email}</p>
      </div>
    );
  }
}
```

### **Props (Properties)**
Data passed from parent to child components. **Read-only**.

```javascript
// Parent Component
function App() {
  const user = { name: 'John', age: 25 };
  return <UserProfile user={user} isActive={true} />;
}

// Child Component
function UserProfile({ user, isActive }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Age: {user.age}</p>
      {isActive && <span className="active">Online</span>}
    </div>
  );
}
```

### **Conditional Rendering**
Show/hide elements based on conditions.

```javascript
function UserStatus({ isLoggedIn, user }) {
  // Method 1: Ternary Operator
  return (
    <div>
      {isLoggedIn ? (
        <h2>Welcome back, {user.name}!</h2>
      ) : (
        <h2>Please log in</h2>
      )}
    </div>
  );
}

// Method 2: Logical AND
function Notifications({ messages }) {
  return (
    <div>
      {messages.length > 0 && (
        <div>You have {messages.length} new messages</div>
      )}
    </div>
  );
}

// Method 3: Early Return
function UserDashboard({ user }) {
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>Dashboard for {user.name}</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### **List Rendering & Keys**
Render arrays of data using `map()`.

```javascript
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// With index (avoid if possible)
function ItemList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```

### **Event Handling**
Handle user interactions like clicks, form submissions.

```javascript
function InteractiveButton() {
  const handleClick = (event) => {
    console.log('Button clicked!', event);
  };

  const handleInputChange = (event) => {
    console.log('Input value:', event.target.value);
  };

  return (
    <div>
      <button onClick={handleClick}>Click Me</button>
      <input onChange={handleInputChange} placeholder="Type something" />
    </div>
  );
}

// With parameters
function UserList({ users, onUserSelect }) {
  return (
    <div>
      {users.map(user => (
        <button 
          key={user.id} 
          onClick={() => onUserSelect(user.id)}
        >
          {user.name}
        </button>
      ))}
    </div>
  );
}
```

---

## **2. useState Hook**

### **Purpose**
Add state (memory) to function components. State persists between re-renders.

### **Basic Syntax**
```javascript
const [stateValue, setStateFunction] = useState(initialValue);
```

### **Examples**

#### **Simple State**
```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

#### **Object State**
```javascript
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const handleInputChange = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,      // Spread previous state
      [field]: value    // Update specific field
    }));
  };

  return (
    <form>
      <input 
        value={user.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Name"
      />
      <input 
        value={user.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="Email"
      />
      <input 
        type="number"
        value={user.age}
        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
        placeholder="Age"
      />
    </form>
  );
}
```

#### **Array State**
```javascript
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prevTodos => [...prevTodos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <input 
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add new todo"
      />
      <button onClick={addTodo}>Add</button>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span 
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### **Important Rules**
- **Don't mutate state directly**: Use setter function
- **Use functional updates** for state that depends on previous state
- **State is asynchronous**: Multiple state updates may be batched

```javascript
// ❌ Wrong - Direct mutation
const [user, setUser] = useState({ name: 'John' });
user.name = 'Jane'; // This won't trigger re-render

// ✅ Correct - Use setter
setUser(prevUser => ({ ...prevUser, name: 'Jane' }));

// ❌ Wrong - Depending on current state
setCount(count + 1);
setCount(count + 1); // May not increment by 2

// ✅ Correct - Functional update
setCount(prevCount => prevCount + 1);
setCount(prevCount => prevCount + 1); // Will increment by 2
```

---

## **3. useEffect Hook**

### **Purpose**
Handle side effects in function components (data fetching, subscriptions, DOM manipulation).

### **Basic Syntax**
```javascript
useEffect(() => {
  // Side effect logic
  return () => {
    // Cleanup logic (optional)
  };
}, [dependencies]); // Dependency array (optional)
```

### **Dependency Array Patterns**

#### **1. No Dependencies - Runs on Every Render**
```javascript
function Component() {
  useEffect(() => {
    console.log('Runs on every render');
  }); // No dependency array
}
```

#### **2. Empty Dependencies - Runs Once (Component Mount)**
```javascript
function Component() {
  useEffect(() => {
    console.log('Runs only once when component mounts');
    
    return () => {
      console.log('Cleanup when component unmounts');
    };
  }, []); // Empty dependency array
}
```

#### **3. With Dependencies - Runs When Dependencies Change**
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Runs when userId changes');
    fetchUser(userId).then(setUser);
  }, [userId]); // Runs when userId changes

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

### **Common Use Cases**

#### **Data Fetching**
```javascript
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Fetch once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### **Event Listeners**
```javascript
function WindowSizeTracker() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup function - remove listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Only run once

  return (
    <div>
      Window size: {windowSize.width} x {windowSize.height}
    </div>
  );
}
```

#### **Timers & Intervals**
```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]); // Re-run when isRunning changes

  return (
    <div>
      <div>Time: {seconds}s</div>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}
```

---

## **4. Custom Hooks**

### **Purpose**
Extract and reuse stateful logic between components. Custom hooks are functions that use React hooks.

### **Naming Convention**
Custom hooks must start with `use` (e.g., `useCounter`, `useApi`, `useLocalStorage`).

### **Simple Custom Hook**
```javascript
// Custom hook: useCounter
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prevCount => prevCount + 1);
  const decrement = () => setCount(prevCount => prevCount - 1);
  const reset = () => setCount(initialValue);

  return {
    count,
    increment,
    decrement,
    reset
  };
}

// Usage in component
function CounterApp() {
  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### **Advanced Custom Hooks**

#### **useLocalStorage Hook**
```javascript
function useLocalStorage(key, initialValue) {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Return wrapped version of useState's setter function that persists to localStorage
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

#### **useApi Hook**
```javascript
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error, refetch } = useApi(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

---

## **5. Context API & Providers**

### **Purpose**
Share data across the component tree without prop drilling. Think of it as a global state accessible to all components within a Provider.

### **Mental Model: WiFi Analogy**
- **Provider** = WiFi router (broadcasts data)
- **Components** = Devices (can connect if in range)
- **useContext** = Connecting to WiFi (only works if router exists)

### **Basic Setup Pattern**

#### **Step 1: Create Context**
```javascript
import { createContext, useContext, useState } from 'react';

// Create context with default value
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});
```

#### **Step 2: Create Provider Component**
```javascript
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

#### **Step 3: Create Custom Hook for Consuming Context**
```javascript
function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
```

#### **Step 4: Use the Provider & Consumer**
```javascript
// App.js - Wrap components with Provider
function App() {
  return (
    <ThemeProvider>
      <Header />
      <MainContent />
      <Footer />
    </ThemeProvider>
  );
}

// Any component inside Provider can access theme
function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`header ${theme}`}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </header>
  );
}
```

---

## **6. React Router**

### **Purpose**
Enable client-side routing in React applications. Create multi-page experiences without full page reloads.

### **Installation**
```bash
npm install react-router-dom
```

### **Basic Setup**

#### **Main App Setup**
```javascript
// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
```

### **Navigation Component**
```javascript
import { Link, NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
    </nav>
  );
}

// NavLink for active styling
function NavigationWithActive() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/about"
            style={({ isActive }) => ({ color: isActive ? 'red' : 'blue' })}
          >
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
```

### **Hooks for Navigation**

#### **useParams - Get URL Parameters**
```javascript
import { useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams(); // Get :id from URL
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>User ID: {id}</p>
    </div>
  );
}
```

#### **useNavigate - Programmatic Navigation**
```javascript
import { useNavigate } from 'react-router-dom';

function UserForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(user);
      // Navigate after successful creation
      navigate('/users');
      // Or navigate with replace (doesn't add to history)
      // navigate('/users', { replace: true });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const goBack = () => {
    navigate(-1); // Go back one page
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
      />
      <button type="submit">Create User</button>
      <button type="button" onClick={goBack}>Go Back</button>
    </form>
  );
}
```

---

## **7. Performance Optimization**

### **Why Optimize?**
React applications can become slow due to:
- Unnecessary re-renders
- Expensive calculations on every render
- Large component trees re-rendering
- Heavy operations in render cycle

### **React.memo - Prevent Unnecessary Re-renders**

#### **Problem: Child Re-renders with Parent**
```javascript
function Parent() {
  const [count, setCount] = useState(0);
  const [users] = useState([/* large array */]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild users={users} /> {/* Re-renders even though users didn't change */}
    </div>
  );
}

function ExpensiveChild({ users }) {
  console.log('ExpensiveChild rendered'); // Logs on every parent re-render
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

#### **Solution: React.memo**
```javascript
// Wrap component with React.memo
const ExpensiveChild = React.memo(function ExpensiveChild({ users }) {
  console.log('ExpensiveChild rendered'); // Only logs when users prop changes
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
});
```

### **useMemo - Cache Expensive Calculations**

#### **Problem: Expensive Calculation on Every Render**
```javascript
function UserDashboard({ users }) {
  const [filter, setFilter] = useState('');

  // This calculation runs on EVERY render, even if users didn't change
  const statistics = {
    total: users.length,
    averageAge: users.reduce((sum, user) => sum + user.age, 0) / users.length,
    activeUsers: users.filter(user => user.active).length
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Filter users"
      />
      <div>Total: {statistics.total}</div>
      <div>Average Age: {statistics.averageAge}</div>
      <div>Active: {statistics.activeUsers}</div>
      <UserList users={filteredUsers} />
    </div>
  );
}
```

#### **Solution: useMemo**
```javascript
function UserDashboard({ users }) {
  const [filter, setFilter] = useState('');

  // Only recalculate when users array changes
  const statistics = useMemo(() => {
    console.log('Calculating statistics...'); // Only logs when users change
    return {
      total: users.length,
      averageAge: users.reduce((sum, user) => sum + user.age, 0) / users.length,
      activeUsers: users.filter(user => user.active).length
    };
  }, [users]);

  // Only recalculate when users or filter changes
  const filteredUsers = useMemo(() => {
    console.log('Filtering users...'); // Only logs when users or filter changes
    return users.filter(user => 
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [users, filter]);

  return (
    <div>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Filter users"
      />
      <div>Total: {statistics.total}</div>
      <div>Average Age: {statistics.averageAge}</div>
      <div>Active: {statistics.activeUsers}</div>
      <UserList users={filteredUsers} />
    </div>
  );
}
```

### **useCallback - Stable Function References**

#### **Problem: Functions Break React.memo**
```javascript
function UserList({ users }) {
  const [selectedUsers, setSelectedUsers] = useState([]);

  // New function created on every render
  const handleUserClick = (user) => {
    setSelectedUsers(prev => [...prev, user]);
  };

  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onClick={handleUserClick} // New function reference every render
        />
      ))}
    </div>
  );
}

// Even with React.memo, this will re-render because onClick prop changes
const UserCard = React.memo(function UserCard({ user, onClick }) {
  console.log('UserCard rendered:', user.name); // Logs every time
  
  return (
    <div onClick={() => onClick(user)}>
      {user.name}
    </div>
  );
});
```

#### **Solution: useCallback**
```javascript
function UserList({ users }) {
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Same function reference unless selectedUsers changes
  const handleUserClick = useCallback((user) => {
    setSelectedUsers(prev => [...prev, user]);
  }, []); // Empty dependency - function never changes

  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onClick={handleUserClick} // Stable function reference
        />
      ))}
    </div>
  );
}

// Now React.memo works properly
const UserCard = React.memo(function UserCard({ user, onClick }) {
  console.log('UserCard rendered:', user.name); // Only logs when user prop changes
  
  return (
    <div onClick={() => onClick(user)}>
      {user.name}
    </div>
  );
});
```

---

## **8. useReducer Hook**

### **Purpose**
Alternative to useState for managing complex state logic. Better for state that involves multiple sub-values or when next state depends on previous state.

### **When to Use useReducer vs useState**

#### **Use useState when:**
- Simple state (strings, numbers, booleans)
- Independent state variables
- Simple state updates

#### **Use useReducer when:**
- Complex state object with multiple fields
- State transitions depend on previous state
- Multiple ways to update the same piece of state
- Logic for state updates is complex

### **Basic useReducer Syntax**
```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

### **Simple Counter Example**
```javascript
// Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Component using useReducer
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'set', payload: 100 })}>Set to 100</button>
    </div>
  );
}
```

### **Complex State Management Example**

#### **User Management with useReducer**
```javascript
// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null,
  filter: '',
  sortBy: 'name',
  selectedUsers: []
};

// Action types
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  SET_FILTER: 'SET_FILTER',
  SET_SORT: 'SET_SORT',
  SELECT_USER: 'SELECT_USER',
  CLEAR_SELECTION: 'CLEAR_SELECTION'
};

// Reducer function
function userReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null
      };

    case ACTIONS.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ACTIONS.ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload]
      };

    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };

    case ACTIONS.DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        selectedUsers: state.selectedUsers.filter(id => id !== action.payload)
      };

    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };

    case ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload
      };

    case ACTIONS.SELECT_USER:
      const isSelected = state.selectedUsers.includes(action.payload);
      return {
        ...state,
        selectedUsers: isSelected
          ? state.selectedUsers.filter(id => id !== action.payload)
          : [...state.selectedUsers, action.payload]
      };

    case ACTIONS.CLEAR_SELECTION:
      return {
        ...state,
        selectedUsers: []
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Component using the reducer
function UserManagement() {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: ACTIONS.FETCH_START });
      try {
        const response = await fetch('/api/users');
        const users = await response.json();
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: users });
      } catch (error) {
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      }
    };

    fetchUsers();
  }, []);

  // Memoized processed users
  const processedUsers = useMemo(() => {
    let filtered = state.users.filter(user =>
      user.name.toLowerCase().includes(state.filter.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (state.sortBy === 'name') return a.name.localeCompare(b.name);
      if (state.sortBy === 'age') return a.age - b.age;
      return 0;
    });
  }, [state.users, state.filter, state.sortBy]);

  // Action handlers
  const addUser = async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const newUser = await response.json();
      dispatch({ type: ACTIONS.ADD_USER, payload: newUser });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  };

  const deleteUser = async (userId) => {
    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      dispatch({ type: ACTIONS.DELETE_USER, payload: userId });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  };

  if (state.loading) return <div>Loading...</div>;
  if (state.error) return <div>Error: {state.error}</div>;

  return (
    <div>
      <div className="controls">
        <input
          type="text"
          placeholder="Filter users..."
          value={state.filter}
          onChange={(e) => dispatch({ type: ACTIONS.SET_FILTER, payload: e.target.value })}
        />
        
        <select
          value={state.sortBy}
          onChange={(e) => dispatch({ type: ACTIONS.SET_SORT, payload: e.target.value })}
        >
          <option value="name">Sort by Name</option>
          <option value="age">Sort by Age</option>
        </select>

        {state.selectedUsers.length > 0 && (
          <div>
            <span>{state.selectedUsers.length} selected</span>
            <button onClick={() => dispatch({ type: ACTIONS.CLEAR_SELECTION })}>
              Clear Selection
            </button>
          </div>
        )}
      </div>

      <div className="user-list">
        {processedUsers.map(user => (
          <div 
            key={user.id} 
            className={`user-card ${state.selectedUsers.includes(user.id) ? 'selected' : ''}`}
          >
            <input
              type="checkbox"
              checked={state.selectedUsers.includes(user.id)}
              onChange={() => dispatch({ type: ACTIONS.SELECT_USER, payload: user.id })}
            />
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>Age: {user.age}</p>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## **9. Redux & Redux Toolkit**

### **What is Redux?**
Redux is a predictable state container for JavaScript applications. It helps you write applications that behave consistently, run in different environments, and are easy to test.

### **Core Principles**
1. **Single Source of Truth** - The global state is stored in a single store
2. **State is Read-Only** - State can only be changed by dispatching actions
3. **Changes Made with Pure Functions** - Reducers are pure functions that take the previous state and an action, and return the next state

### **Redux vs Context**

| Feature | Context | Redux |
|---------|---------|--------|
| **Setup Complexity** | Simple | More setup required |
| **Performance** | Re-renders all consumers | Selective re-renders |
| **DevTools** | None | Time travel debugging |
| **Middleware** | Not supported | Extensive middleware ecosystem |
| **Scalability** | Provider hell with multiple contexts | Single store, easy to scale |
| **Job Market** | Limited demand | High demand (60% of React jobs) |

### **Traditional Redux (Don't Use This)**
Traditional Redux requires a lot of boilerplate code:

```javascript
// Action Types
const ADD_USER = 'ADD_USER';
const DELETE_USER = 'DELETE_USER';

// Action Creators
function addUser(user) {
  return { type: ADD_USER, payload: user };
}

function deleteUser(id) {
  return { type: DELETE_USER, payload: id };
}

// Reducer
function usersReducer(state = [], action) {
  switch (action.type) {
    case ADD_USER:
      return [...state, action.payload];
    case DELETE_USER:
      return state.filter(user => user.id !== action.payload);
    default:
      return state;
  }
}

// Store
const store = createStore(usersReducer);
```

### **Modern Redux (Redux Toolkit)**
Redux Toolkit (RTK) simplifies Redux development:

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

// Slice (combines actions, action creators, and reducer)
const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    addUser: (state, action) => {
      state.push(action.payload); // Immer makes this safe
    },
    deleteUser: (state, action) => {
      return state.filter(user => user.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    }
  }
});

// Export actions (automatically created)
export const { addUser, deleteUser, updateUser } = usersSlice.actions;

// Export reducer
export default usersSlice.reducer;
```

### **Complete Redux Setup**

#### **1. Store Configuration**
```javascript
// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import postsReducer from './slices/postsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    auth: authReducer
  },
  // Redux DevTools enabled automatically in development
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### **2. Provider Setup**
```javascript
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

#### **3. Complex Slice Example**
```javascript
// store/slices/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to create user');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedUser: null,
    filter: ''
  },
  reducers: {
    // Synchronous actions
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserLocal: (state, action) => {
      const index = state.items.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    // Handle async actions
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilter, selectUser, clearError, updateUserLocal } = usersSlice.actions;
export default usersSlice.reducer;
```

#### **4. Using Redux in Components**
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, createUser, setFilter, selectUser } from '../store/slices/usersSlice';

function UserManagement() {
  const dispatch = useDispatch();
  
  // Select data from store
  const {
    items: users,
    loading,
    error,
    filter,
    selectedUser
  } = useSelector(state => state.users);

  // Memoized selectors for performance
  const filteredUsers = useSelector(state => {
    const { items, filter } = state.users;
    return items.filter(user => 
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateUser = async (userData) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      // Handle success
    } catch (error) {
      // Handle error
      console.error('Failed to create user:', error);
    }
  };

  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter));
  };

  const handleUserSelect = (user) => {
    dispatch(selectUser(user));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Filter users..."
        value={filter}
        onChange={(e) => handleFilterChange(e.target.value)}
      />
      
      <div>
        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            onClick={() => handleUserSelect(user)}
            className={selectedUser?.id === user.id ? 'selected' : ''}
          >
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}
      </div>

      <UserForm onSubmit={handleCreateUser} />
    </div>
  );
}
```

### **Redux DevTools**
Redux DevTools provide powerful debugging capabilities:

1. **Install browser extension**: Redux DevTools
2. **Time travel debugging**: Jump to any previous state
3. **Action replay**: Reproduce bugs exactly
4. **State export/import**: Save and restore app state
5. **Performance monitoring**: Track action performance

### **Best Practices**
1. **Use Redux Toolkit** - Never write traditional Redux
2. **Normalize state shape** - For large, relational data
3. **Keep reducers pure** - No side effects in reducers
4. **Use selectors** - Encapsulate state access logic
5. **Connect components wisely** - Don't over-connect
6. **Use async thunks** - For API calls
7. **Structure by features** - Not by file types

---

## **10. Best Practices & Patterns**

### **Component Organization**

#### **Folder Structure**
```
src/
  components/
    common/
      Button/
        Button.tsx
        Button.module.css
        Button.test.tsx
        index.ts
      Modal/
        Modal.tsx
        Modal.module.css
        index.ts
    features/
      users/
        UserList/
          UserList.tsx
          UserList.module.css
          index.ts
        UserForm/
          UserForm.tsx
          UserForm.module.css
          index.ts
        hooks/
          useUsers.ts
          useUserForm.ts
        types/
          user.types.ts
  hooks/
    useApi.ts
    useLocalStorage.ts
    useDebounce.ts
  services/
    api.ts
    auth.ts
  store/
    slices/
      usersSlice.ts
      authSlice.ts
    store.ts
  utils/
    helpers.ts
    constants.ts
  types/
    global.types.ts
```

### **Component Design Patterns**

#### **1. Container/Presentational Pattern**
```javascript
// Container Component (logic)
function UserListContainer() {
  const { users, loading, error, deleteUser } = useUsers();
  const [filter, setFilter] = useState('');

  const filteredUsers = useMemo(() =>
    users.filter(user => user.name.includes(filter)),
    [users, filter]
  );

  return (
    <UserListPresentation
      users={filteredUsers}
      loading={loading}
      error={error}
      filter={filter}
      onFilterChange={setFilter}
      onDeleteUser={deleteUser}
    />
  );
}

// Presentational Component (UI only)
function UserListPresentation({
  users,
  loading,
  error,
  filter,
  onFilterChange,
  onDeleteUser
}) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <SearchInput value={filter} onChange={onFilterChange} />
      <div>
        {users.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={() => onDeleteUser(user.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

### **Common Anti-Patterns to Avoid**

#### **1. Don't Mutate State**
```javascript
// ❌ Bad
const [users, setUsers] = useState([]);
users.push(newUser); // Mutating state directly

// ✅ Good
setUsers(prevUsers => [...prevUsers, newUser]);
```

#### **2. Don't Use Array Index as Key**
```javascript
// ❌ Bad - Can cause rendering issues
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}

// ✅ Good - Use unique, stable identifiers
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

#### **3. Don't Call Hooks Conditionally**
```javascript
// ❌ Bad
if (user) {
  const [profile, setProfile] = useState(null);
}

// ✅ Good
const [profile, setProfile] = useState(null);
if (user) {
  // Use the state
}
```

### **Performance Best Practices**

#### **1. Avoid Inline Objects and Functions**
```javascript
// ❌ Bad - Creates new object on every render
function UserCard({ user }) {
  return (
    <div style={{ padding: '10px', margin: '5px' }}>
      <button onClick={() => console.log('clicked')}>
        {user.name}
      </button>
    </div>
  );
}

// ✅ Good - Stable references
const cardStyle = { padding: '10px', margin: '5px' };

function UserCard({ user, onUserClick }) {
  const handleClick = useCallback(() => {
    onUserClick(user.id);
  }, [user.id, onUserClick]);

  return (
    <div style={cardStyle}>
      <button onClick={handleClick}>
        {user.name}
      </button>
    </div>
  );
}
```

### **Error Handling Patterns**

#### **Error Boundary**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <UserDashboard />
    </ErrorBoundary>
  );
}
```

#### **Hook for Error Handling**
```javascript
function useErrorHandler() {
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((error) => {
    console.error('Error occurred:', error);
    setError(error);
    
    // Send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      errorReportingService.captureException(error);
    }
  }, []);

  return { error, handleError, clearError };
}
```

### **Testing Patterns**

#### **Component Testing**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import UserList from './UserList';

function renderWithProviders(ui) {
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  );
}

test('renders user list', () => {
  renderWithProviders(<UserList />);
  expect(screen.getByText('Users')).toBeInTheDocument();
});

test('filters users when typing in search', async () => {
  renderWithProviders(<UserList />);
  
  const searchInput = screen.getByPlaceholderText('Search users...');
  fireEvent.change(searchInput, { target: { value: 'john' } });
  
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
  expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
});
```

#### **Hook Testing**
```javascript
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### **Accessibility Best Practices**
```javascript
function AccessibleForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  return (
    <form>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-describedby={error ? 'name-error' : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <div id="name-error" role="alert">
          {error}
        </div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

This completes the comprehensive React reference guide covering all the topics you've learned. Each section includes practical examples, best practices, and common patterns used in production React applications.

**🎉 Status: Complete React Reference Guide!**

*This guide represents everything from React basics to advanced state management patterns - your complete reference for professional React development.*