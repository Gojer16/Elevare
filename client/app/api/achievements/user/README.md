# User Achievements API

## `/api/achievements/user`

### `GET`

Retrieves a list of all achievements unlocked by the authenticated user.

**Description:**
This endpoint fetches a record of all achievements that the currently authenticated user has unlocked. For each unlocked achievement, it returns the achievement's ID and the timestamp of when it was unlocked.

**Authentication:**
This endpoint requires the user to be authenticated.

**Responses:**

-   `200 OK`: Successfully retrieved the list of unlocked achievements. The response body will be a JSON array of user achievement objects.
-   `401 Unauthorized`: If the user is not authenticated.
-   `500 Internal Server Error`: If there was an error on the server.

**Example Response (200 OK):**
```json
[
  {
    "achievementId": "clxne336b000008l3f2g3h4j5",
    "unlockedAt": "2025-09-22T12:34:56.789Z"
  },
  {
    "achievementId": "clxne336b000108l3f2g3h4j6",
    "unlockedAt": "2025-09-23T18:00:00.000Z"
  }
]
```
