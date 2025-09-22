# Admin Users API

## `/api/admin/users`

This API is for administrative purposes and requires developer-level access.

---

### `GET`

Retrieves a paginated and filtered list of users.

**Authorization:**
Requires developer access.

**Query Parameters:**

-   `page` (optional): The page number for pagination. Defaults to `1`. 
-   `limit` (optional): The number of users per page. Defaults to `10`.
-   `plan` (optional): Filter users by their plan (`free`, `premium`, `pro`). Defaults to `all`.

**Responses:**

-   `200 OK`: Successfully retrieved the list of users.
-   `401 Unauthorized`: If the user does not have developer access.
-   `500 Internal Server Error`: If there was an error on the server.

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "2",
        "email": "user2@example.com",
        "name": "Jane Smith",
        "plan": "premium",
        "createdAt": "2024-01-10T08:00:00Z",
        "lastActive": "2024-01-21T09:15:00Z",
        "tasksCompleted": 128
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 1,
      "total": 1,
      "totalPages": 1
    },
    "stats": {
      "totalUsers": 1,
      "planDistribution": {
        "free": 0,
        "premium": 1,
        "pro": 0
      }
    }
  },
  "requestedBy": {
    "id": "dev-user-id",
    "email": "developer@example.com",
    "isDeveloper": true
  }
}
```

---

### `PUT`

Updates a specific user's subscription plan.

**Authorization:**
Requires developer access.

**Request Body:**

-   `userId` (string, required): The ID of the user to update.
-   `plan` (string, required): The new plan for the user. Must be one of `free`, `premium`, or `pro`.

**Responses:**

-   `200 OK`: Successfully updated the user's plan.
-   `400 Bad Request`: If `userId` or `plan` are missing or invalid.
-   `401 Unauthorized`: If the user does not have developer access.
-   `500 Internal Server Error`: If there was an error on the server.

**Example Request:**
```json
{
  "userId": "2",
  "plan": "pro"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "User plan updated to pro",
  "updatedBy": "developer@example.com",
  "timestamp": "2025-09-22T20:00:00.000Z"
}
```
