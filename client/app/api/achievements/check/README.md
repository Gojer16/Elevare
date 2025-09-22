# Achievements Check API

## `/api/achievements/check`

### `POST`

Checks for and unlocks new achievements for the authenticated user.

**Description:**
This endpoint is called to evaluate the user's progress and unlock any achievements they have earned. It also updates the user's daily streak. This is typically called after a user completes a task.

**Authentication:**
This endpoint requires the user to be authenticated.

**Responses:**

-   `200 OK`: Successfully checked for achievements. The response body will contain the user's current streak and a list of any newly unlocked achievements.
-   `401 Unauthorized`: If the user is not authenticated.
-   `500 Internal Server Error`: If there was an error on the server.

**Example Response (200 OK):**
```json
{
  "streak": 5,
  "newlyUnlocked": [
    {
      "id": "clxne336b000108l3f2g3h4j6",
      "name": "Task Master",
      "description": "You completed 10 tasks!",
      "criteria": "{\"taskCount\":10}",
      "createdAt": "2025-09-22T10:00:00.000Z",
      "updatedAt": "2025-09-22T10:00:00.000Z"
    }
  ]
}
```

```