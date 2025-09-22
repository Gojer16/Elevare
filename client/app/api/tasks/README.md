# Tasks API

This API provides comprehensive endpoints for managing user tasks. It includes functionality for creating, retrieving, updating, and deleting tasks, as well as managing associated tags.

**Business Rules:**
- A user can only have one active (not done) task at a time.
- `completedAt` timestamps are managed by the server and cannot be set by the client.

---

## Endpoints

### `/api/tasks`

#### `GET`

Retrieves all of the authenticated user's tasks, sorted with the newest first.

**Authentication:** Required.

**Responses:**

-   `200 OK`: A list of the user's tasks.
-   `401 Unauthorized`: If the user is not authenticated.
-   `500 Internal Server Error`: If there was a server-side error.

**Example Response (200 OK):**
```json
[
  {
    "id": "task-id-1",
    "title": "My Active Task",
    "description": "This is the task I am currently working on.",
    "isDone": false,
    "createdAt": "2025-09-23T10:00:00.000Z",
    "completedAt": null,
    "reflection": null,
    "tags": [{ "id": "tag-1", "name": "Work" }]
  },
  {
    "id": "task-id-2",
    "title": "My Completed Task",
    "description": null,
    "isDone": true,
    "createdAt": "2025-09-22T15:00:00.000Z",
    "completedAt": "2025-09-22T18:30:00.000Z",
    "reflection": "It went well.",
    "tags": []
  }
]
```

---

#### `POST`

Creates a new task for the authenticated user.

**Authentication:** Required.

**Constraint:** A user can only have one active (`isDone: false`) task. This endpoint will fail if the user already has an active task.

**Request Body:**

-   `title` (string, required): The title of the task.
-   `description` (string, optional): A description for the task.
-   `tagNames` (string[], optional): An array of tag names to associate with the task. Tags will be created if they don't already exist for the user.

**Responses:**

-   `201 Created`: The task was created successfully.
-   `400 Bad Request`: If the request body is invalid or the user already has an active task.
-   `401 Unauthorized`: If the user is not authenticated.
-   `500 Internal Server Error`: If there was a server-side error.

**Example Request:**
```json
{
  "title": "Start a new project",
  "description": "Set up the repository and initial project structure.",
  "tagNames": ["Work", "Coding"]
}
```

---

### `/api/tasks/{id}`

#### `GET`

Retrieves a single task by its ID.

**Authentication:** Required.

**Responses:**

-   `200 OK`: The requested task object.
-   `401 Unauthorized`: If the user is not authenticated.
-   `404 Not Found`: If the task does not exist or does not belong to the user.
-   `500 Internal Server Error`: If there was a server-side error.

---

#### `PUT`

Updates an existing task by its ID. Only the user who owns the task can update it.

**Authentication:** Required.

**Request Body (all fields are optional):**

-   `title` (string, optional): The new title for the task.
-   `description` (string | null, optional): The new description.
-   `isDone` (boolean, optional): The new completion status.
    -   Setting to `true` sets the `completedAt` timestamp.
    -   Setting to `false` clears the `completedAt` timestamp and any associated `reflection`.
-   `reflection` (string | null, optional): A reflection on the completed task.
-   `tagNames` (string[], optional): A new set of tag names for the task. This will replace all existing tags on the task.

**Responses:**

-   `200 OK`: The task was updated successfully.
-   `400 Bad Request`: If the request body is invalid.
-   `401 Unauthorized`: If the user is not authenticated.
-   `404 Not Found`: If the task does not exist or does not belong to the user.
-   `500 Internal Server Error`: If there was a server-side error.

---

#### `DELETE`

Deletes a task by its ID. Only the user who owns the task can delete it.

**Authentication:** Required.

**Responses:**

-   `204 No Content`: The task was deleted successfully.
-   `401 Unauthorized`: If the user is not authenticated.
-   `404 Not Found`: If the task does not exist or does not belong to the user.
-   `500 Internal Server Error`: If there was a server-side error.