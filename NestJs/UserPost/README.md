# NestJS Boilerplate - User & Post APIs

A comprehensive NestJS boilerplate with User authentication and Post management APIs. Perfect for understanding NestJS architecture and exploring TypeScript-based backend development.

##  Features

- **JWT Authentication** - Secure login/logout system
- **User Management** - Complete CRUD operations for users
- **Post Management** - Full blog-like post system with relationships
- **TypeScript** - Full type safety throughout the application
- **Swagger Documentation** - Auto-generated API documentation
- **SQLite Database** - Easy setup with TypeORM
- **Validation** - Request/response validation with class-validator
- **Error Handling** - Comprehensive error responses

##  API Endpoints

### Authentication
- `POST /auth/login` - Login user

### Users
- `POST /users` - Register new user (public)
- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `PATCH /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)

### Posts
- `GET /posts` - Get all posts (public)
- `GET /posts?published=true` - Get published posts only
- `GET /posts?userId=1` - Get posts by user
- `GET /posts/:id` - Get single post (public)
- `POST /posts` - Create new post (protected)
- `PATCH /posts/:id` - Update post (protected, owner only)
- `DELETE /posts/:id` - Delete post (protected, owner only)
- `PATCH /posts/:id/publish` - Publish post (protected, owner only)
- `PATCH /posts/:id/unpublish` - Unpublish post (protected, owner only)

##  Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the application**
   ```bash
   # Development mode with hot reload
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

3. **Access the application**
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api

##  Testing the APIs

### 1. Create a User
```bash
curl -X POST http://localhost:3000/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john.doe@example.com",
    "name": "John Doe",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

Save the `access_token` from the response for protected endpoints.

### 3. Create a Post
```bash
curl -X POST http://localhost:3000/posts \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post using NestJS!",
    "published": true
  }'
```

### 4. Get All Posts
```bash
curl http://localhost:3000/posts
```

## Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── dto/               # Data transfer objects
│   ├── guards/            # Auth guards
│   ├── strategies/        # Passport strategies
│   ├── auth.controller.ts # Auth endpoints
│   ├── auth.service.ts    # Auth business logic
│   └── auth.module.ts     # Auth module definition
├── users/                 # Users module
│   ├── dto/              # User DTOs
│   ├── entities/         # User entity
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── posts/                 # Posts module
│   ├── dto/              # Post DTOs
│   ├── entities/         # Post entity
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   └── posts.module.ts
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

##  Key NestJS Concepts Demonstrated

### 1. **Modules**
Each feature (Users, Posts, Auth) is organized in its own module with clear boundaries.

### 2. **Dependency Injection**
Services are injected into controllers and other services through constructor injection.

### 3. **Decorators**
- `@Controller()` - Define route controllers
- `@Injectable()` - Mark classes as injectable services  
- `@Entity()` - Define database entities
- `@UseGuards()` - Apply authentication/authorization
- `@ApiTags()` - Group endpoints in Swagger

### 4. **Guards**
JWT authentication is implemented using Passport.js strategy and guards.

### 5. **Pipes**
Validation pipes automatically validate request bodies using class-validator.

### 6. **Relationships**
User-Post relationship demonstrates TypeORM associations.

##  Learning Path

1. **Start with the basics**: Explore the User module to understand entities, DTOs, services, and controllers
2. **Authentication**: Study the auth module to see JWT implementation
3. **Relationships**: Examine how Users and Posts are related
4. **Advanced features**: Look at post publishing, filtering, and ownership checks
5. **API Testing**: Use Swagger UI to test all endpoints interactively

##  Example Data Flow

```
1. User Registration (POST /users)
   ↓
2. User Login (POST /auth/login) → Receives JWT token
   ↓  
3. Create Post (POST /posts) → Uses JWT for auth
   ↓
4. Fetch Posts (GET /posts) → Public endpoint
   ↓
5. Update Own Post (PATCH /posts/:id) → Ownership validation
```

##  Learning Resources

- **Swagger UI**: Visit `/api` to see interactive documentation
- **Database**: SQLite file `database.sqlite` created automatically
- **Logs**: Check console output for database queries and errors
- **TypeScript**: Hover over variables in your IDE to see inferred types

##  Security Features

- Password hashing with bcrypt
- JWT token authentication  
- Request validation with class-validator
- Authorization checks (users can only modify their own posts)
- CORS enabled for frontend integration

## Next Steps

Once you're comfortable with this boilerplate, try:

1. Adding more entities (Comments, Categories, etc.)
2. Implementing role-based authorization  
3. Adding file upload functionality
4. Setting up automated tests
5. Integrating with a PostgreSQL database
6. Adding pagination and search features

Happy coding with NestJS! 