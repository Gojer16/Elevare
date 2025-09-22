# Analytics API

## `/api/analytics`

This API provides access to user analytics data and event tracking. Access to these endpoints requires the user to have the "ANALYTICS" feature enabled on their plan.

---

### `GET`

Retrieves a summary of analytics data for the authenticated user.

**Authorization:**
Requires the `ANALYTICS` feature.

**Responses:**

-   `200 OK`: Successfully retrieved the analytics data.
-   `401 Unauthorized` or `403 Forbidden`: If the user does not have access to the feature.
-   `500 Internal Server Error`: If there was an error on the server.

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-id-123",
    "completionRate": 85,
    "streakDays": 14,
    "focusScore": "8.2",
    "weeklyProgress": [90, 80, 95, 70, 75, 88, 92],
    "totalTasks": 250,
    "completedTasks": 212,
    "averageCompletionTime": 45,
    "productivityTrend": [
      { "date": "2025-08-24", "score": 78 },
      { "date": "2025-08-25", "score": 82 }
    ]
  },
  "plan": "premium",
  "generatedAt": "2025-09-22T20:30:00.000Z"
}
```

---

### `POST`

Tracks a custom analytics event for the authenticated user.

**Authorization:**
Requires the `ANALYTICS` feature.

**Request Body:**

-   `event` (string, required): The name of the event to track (e.g., `task_completed`, `feature_used`).
-   `properties` (object, optional): Additional data associated with the event.

**Responses:**

-   `200 OK`: Successfully tracked the event.
-   `400 Bad Request`: If the `event` name is missing.
-   `401 Unauthorized` or `403 Forbidden`: If the user does not have access to the feature.
-   `500 Internal Server Error`: If there was an error on the server.

**Example Request:**
```json
{
  "event": "theme_changed",
  "properties": {
    "newTheme": "dark",
    "source": "settings_page"
  }
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Event tracked successfully"
}
```
