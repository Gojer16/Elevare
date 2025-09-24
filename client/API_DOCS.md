# Elevare API Documentation

This document provides comprehensive documentation for the Elevare application's API endpoints, database schema, and dashboard components.

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Dashboard Components](#dashboard-components)
4. [Authentication](#authentication)

## Database Schema

The Elevare application uses a PostgreSQL database managed by Prisma ORM. Here's an overview of the main data models:

### User Model
- `id`: Unique identifier (cuid)
- `name`: User's display name (optional)
- `email`: User's email address (unique)
- `emailVerified`: Timestamp when email was verified (optional)
- `hashedPassword`: Hashed password for email/password auth (optional)
- `image`: URL to profile image (optional)
- `themePreference`: UI theme (default: MODERN)
- `timezone`: User's timezone (optional)
- Associations: `accounts`, `reflections`, `sessions`, `streak`, `tags`, `tasks`, `achievements`, `weeklySummaries`

### Task Model
- `id`: Unique identifier (cuid)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `title`: Task title
- `description`: Task description (optional)
- `isDone`: Completion status (default: false)
- `reflection`: User's reflection (optional, deprecated in favor of Reflection model)
- `userId`: Foreign key to User
- `completedAt`: Completion timestamp (optional)
- Associations: `reflections`, `user`, `tags`

### Reflection Model
- `id`: Unique identifier (cuid)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `content`: The actual reflection text
- `aiFeedback`: AI-generated feedback (optional)
- `taskId`: Foreign key to Task (optional)
- `userId`: Foreign key to User
- Associations: `task`, `user`

### Streak Model
- `id`: Unique identifier (cuid)
- `userId`: Foreign key to User (unique)
- `count`: Current streak count
- `longest`: Longest streak achieved
- `lastActive`: Timestamp of last activity
- Association: `user`

### Achievement Model
- `id`: Unique identifier (cuid)
- `code`: Unique code for the achievement (used in logic)
- `title`: Display title
- `description`: Detailed description of how to earn
- `icon`: Icon representing the achievement (optional)
- `category`: Category (TASK, STREAK, REFLECTION, OTHER)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- Association: `userAchievements`

### UserAchievement Model
- `id`: Unique identifier (cuid)
- `userId`: Foreign key to User
- `achievementId`: Foreign key to Achievement
- `unlockedAt`: Timestamp when earned
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- Associations: `achievement`, `user`

## API Endpoints

### Tasks API

#### GET /api/tasks
Retrieve all tasks for the authenticated user.

**Authentication**: Required (NextAuth session)

**Response**:
- 200: Array of user's tasks with associated tags
- 401: Unauthorized if no valid session exists
- 500: Internal server error

#### POST /api/tasks
Create a new task for the authenticated user.

**Authentication**: Required (NextAuth session)

**Request Body**: 
```json
{
  "title": "string",
  "description": "string (optional)",
  "isDone": "boolean (optional, default false)",
  "tagNames": "string[] (optional)"
}
```

**Business Rules**:
- A user can only have one active (not completed) task at a time
- A user can only complete one task per day

**Response**:
- 200: Created task object
- 400: Validation error or business rule violation
- 401: Unauthorized if no valid session exists
- 500: Internal server error

#### PUT /api/tasks/[id]
Update an existing task for the authenticated user.

**Authentication**: Required (NextAuth session)

**Path Parameters**: 
- `id`: The ID of the task to update

**Request Body**: (All fields optional for partial updates)
```json
{
  "title": "string (optional)",
  "description": "string | null (optional)",
  "isDone": "boolean (optional)",
  "reflection": "string | null (optional)",
  "tagNames": "string[] (optional)"
}
```

**Business Logic**:
- If isDone=false: clears reflection and completedAt
- If isDone=true and not previously completed: sets completedAt

**Response**:
- 200: Updated task object with tags
- 400: Invalid ID or request body
- 401: Unauthorized if no valid session exists
- 404: Task not found or not owned by user
- 500: Internal server error

### Streak API

#### GET /api/streak
Retrieve the user's streak data.

**Authentication**: Required (NextAuth session)

**Response**:
- 200: Streak data object
- 401: Unauthorized
- 500: Internal server error

#### POST /api/streak
Update the user's streak.

**Authentication**: Required (NextAuth session)

**Request Body**:
```json
{
  "action": "string (increment|reset)"
}
```

**Response**:
- 200: Updated streak data
- 400: Invalid action
- 401: Unauthorized
- 500: Internal server error

### Reflection API

#### POST /api/reflection
Create a new reflection with AI feedback generation.

**Authentication**: Required (NextAuth session)

**Request Body**:
```json
{
  "message": "string (required)",
  "taskId": "string (optional)"
}
```

**Response**:
- 200: Success response with AI feedback and reflection ID
- 400: Missing message
- 401: Unauthorized
- 500: Internal server error

#### GET /api/reflection
Retrieve paginated reflection history for authenticated user.

**Authentication**: Required (NextAuth session)

**Query Parameters**:
- `limit`: Number of reflections per page (default: 10)
- `page`: Page number (default: 1)

**Response**:
- 200: Paginated list of reflections
- 401: Unauthorized
- 500: Internal server error

## Dashboard Components

The main dashboard is composed of several key components:

### DashboardPage
The main dashboard page that orchestrates the user experience:
- Manages state for tasks, streaks, and user interactions
- Coordinates with hooks for data fetching and business logic
- Handles UI state for modals, celebrations, and user guidance
- Provides interfaces to core functionality

### useTasks Hook
Provides complete interface to task management functionality:
- Data fetching and caching with React Query
- Task creation, updating, and deletion
- Streak and achievement management
- UI state management

Key functions provided:
- `addTask`: Create a new task
- `completeTask`: Mark the current task as completed
- `saveReflection`: Save user's reflection
- `editTask`: Update task details
- `fetchTasks`: Refresh task data
- `fetchStreak`: Refresh streak data

### TaskSection Component
Handles the visual representation and interaction with the current task:
- Displays the current task title and description
- Provides UI for completing the task
- Shows task completion celebrations
- Handles task editing and reflection

### DashboardModals Component
Manages the modals for task editing and reflection:
- Reflection modal for providing feedback on completed tasks
- Edit modal for updating task details
- Handles saving and validation for both operations

## Authentication

The application uses NextAuth.js for authentication with the following providers:
- Email/password authentication
- OAuth providers (Google, GitHub, etc.)

The system maintains user sessions and protects API routes through middleware. Authentication is required for all task-related operations.