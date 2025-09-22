# Achievements Progress API

## `/api/achievements/progress`

### `GET`

Retrieves the authenticated user's progress towards all achievements.

**Description:**
This endpoint provides a comprehensive overview of the user's progress for every available achievement. It indicates which achievements are unlocked, when they were unlocked, and the user's current progress toward those that are still locked.

**Authentication:**
This endpoint requires the user to be authenticated.

**Responses:**

-   `200 OK`: Successfully retrieved the achievement progress. The response body will contain a summary of the user's overall progress and a detailed list of each achievement with its current status.
-   `401 Unauthorized`: If the user is not authenticated.
-   `500 Internal Server Error`: If there was an error on the server.

**Example Response (200 OK):**
```json
{
  "totals": {
    "total": 20,
    "unlocked": 5,
    "completion": 25
  },
  "progress": [
    {
      "id": "clxne336b000008l3f2g3h4j5",
      "code": "first_task",
      "title": "First Step",
      "description": "Complete your very first task.",
      "icon": "first_step_icon",
      "category": "Tasks",
      "target": 1,
      "current": 1,
      "unlocked": true,
      "unlockedAt": "2025-09-22T12:34:56.789Z",
      "conditionText": "Complete your first task"
    },
    {
      "id": "clxne336b000108l3f2g3h4j6",
      "code": "tasks_10",
      "title": "Task Enthusiast",
      "description": "Complete 10 tasks.",
      "icon": "tasks_10_icon",
      "category": "Tasks",
      "target": 10,
      "current": 7,
      "unlocked": false,
      "unlockedAt": null,
      "conditionText": "Complete 10 tasks"
    }
  ]
}
```
