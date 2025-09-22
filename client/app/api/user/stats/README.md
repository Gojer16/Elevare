# User Stats API

This API endpoint retrieves various statistics for the authenticated user.

## GET /api/user/stats

**Summary:** Retrieve user statistics

**Description:** Fetches a variety of user statistics, including completed tasks, written reflections, and streak information.

**Responses:**

- `200 OK`: Successfully retrieved user statistics.

  ```json
  {
    "tasksCompleted": 10,
    "reflectionsWritten": 5,
    "streakCount": 3,
    "longestStreak": 7
  }
  ```

- `401 Unauthorized`: Unauthorized. User is not authenticated.
- `500 Internal Server Error`: Internal server error.
