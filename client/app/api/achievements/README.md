# Achievements API

## `/api/achievements`

### `GET`

Retrieves a list of all achievements.

**Description:**
This endpoint fetches all achievements from the database, ordered by their creation date in ascending order.

**Responses:**

-   `200 OK`: Successfully retrieved the list of achievements. The response body will be a JSON array of achievement objects.
-   `500 Internal Server Error`: If there was an error on the server while fetching the achievements. The response body will contain an error message.

**Example Response (200 OK):**
```json
[
  {
    "id": "clxne336b000008l3f2g3h4j5",
    "name": "First Task",
    "description": "You completed your first task!",
    "criteria": "{\"taskCount\":1}",
    "createdAt": "2025-09-22T10:00:00.000Z",
    "updatedAt": "2025-09-22T10:00:00.000Z"
  },
  {
    "id": "clxne336b000108l3f2g3h4j6",
    "name": "Task Master",
    "description": "You completed 10 tasks!",
    "criteria": "{\"taskCount\":10}",
    "createdAt": "2025-09-22T10:00:00.000Z",
    "updatedAt": "2025-09-22T10:00:00.000Z"
  }
]
```