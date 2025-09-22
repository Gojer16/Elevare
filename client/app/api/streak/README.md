# Streak API

This API is used to manage and retrieve user activity streaks. All endpoints require user authentication.

---

## Endpoints

### `/api/streak`

#### `GET`

Retrieves the current streak data for the authenticated user. If no streak record exists for the user, a new one is created with default values.

**Authentication:** Required.

**Responses:**

-   `200 OK`: Successfully retrieved the streak data.
-   `401 Unauthorized`: If the user is not authenticated.
-   `500 Internal Server Error`: If there was a server-side error.

**Example Response (200 OK):**
```json
{
  "id": "streak-id-123",
  "userId": "user-id-abc",
  "count": 5,
  "longest": 12,
  "lastActive": "2025-09-22T10:00:00.000Z"
}
```

---

#### `POST`

Modifies the user's streak. This can be an increment or a reset.

**Authentication:** Required.

**Request Body:**

-   `action` (string, required): The action to perform. Must be either `increment` or `reset`.

**Logic for `increment`:**

-   If the last active day was today, the streak is not changed.
-   If the last active day was yesterday, the streak count is incremented by 1. The `longest` streak is updated if the new count is greater.
-   If more than one day has passed since the last active day, the streak is reset to 1.

**Logic for `reset`:**

-   The streak count is immediately set to 0.

**Responses:**

-   `200 OK`: Successfully updated the streak. Returns the updated streak object.
-   `400 Bad Request`: If the `action` is missing or invalid.
-   `401 Unauthorized`: If the user is not authenticated.
-   `500 Internal Server Error`: If there was a server-side error.

**Example Request:**
```json
{
  "action": "increment"
}
```

**Example Response (200 OK):**
```json
{
  "id": "streak-id-123",
  "userId": "user-id-abc",
  "count": 6,
  "longest": 12,
  "lastActive": "2025-09-23T11:00:00.000Z"
}
```
