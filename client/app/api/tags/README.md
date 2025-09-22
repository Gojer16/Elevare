# Tags API

This API is for managing user-specific tags, which can be associated with tasks. All endpoints require user authentication.

---

## Endpoints

### `/api/tags`

#### `GET`

Retrieves all tags created by the authenticated user.

**Authentication:** Required.

**Responses:**

-   `200 OK`: Successfully retrieved the list of tags.
-   `401 Unauthorized`: If the user is not authenticated.
-   `500 Internal Server Error`: If there was a server-side error.

**Example Response (200 OK):**
```json
[
  {
    "id": "tag-id-1",
    "name": "Work"
  },
  {
    "id": "tag-id-2",
    "name": "Personal"
  },
  {
    "id": "tag-id-3",
    "name": "Urgent"
  }
]
```

---

#### `POST`

Creates a new tag or retrieves an existing one with the same name for the authenticated user.

**Authentication:** Required.

**Behavior:**
This endpoint is idempotent. If a tag with the specified name already exists for the user, the existing tag will be returned. If it does not exist, a new tag will be created. Tag names are case-insensitive.

**Request Body:**

-   `name` (string, required): The name of the tag.

**Responses:**

-   `200 OK`: If the tag already exists. Returns the existing tag object.
-   `201 Created`: If a new tag was created. Returns the new tag object.
-   `400 Bad Request`: If the `name` is missing or empty.
-   `401 Unauthorized`: If the user is not authenticated.
-   `500 Internal Server Error`: If there was a server-side error.

**Example Request:**
```json
{
  "name": "Health"
}
```

**Example Response (201 Created):**
```json
{
  "id": "tag-id-4",
  "name": "Health",
  "userId": "user-id-abc"
}
```