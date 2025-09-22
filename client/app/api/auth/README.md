# Authentication API

This directory contains all endpoints related to user authentication, registration, and session management.

---

## Endpoints

### `/api/auth/register`

#### `POST`

Registers a new user in the system.

**Request Body:**

-   `name` (string, required): The user's full name.
-   `email` (string, required): The user's email address. Must be unique.
-   `password` (string, required): The user's password.

**Responses:**

-   `200 OK`: User registered successfully. Returns the new user object.
-   `400 Bad Request`: If required fields are missing or if a user with the given email already exists.
-   `500 Internal Server Error`: If there was a server-side error.

**Example Request:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Example Response (200 OK):**
```json
{
  "id": "user-id-456",
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

---

### `/api/auth/login`

#### `POST`

Authenticates a user and initiates a session.

**Request Body:**

-   `email` (string, required): The user's email address.
-   `password` (string, required): The user's password.

**Responses:**

-   `200 OK`: Login successful. Returns the user object.
-   `400 Bad Request`: If `email` or `password` are missing.
-   `401 Unauthorized`: If the credentials are invalid.
-   `500 Internal Server Error`: If there was a server-side error.

**Example Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Example Response (200 OK):**
```json
{
  "id": "user-id-456",
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

---

### `/api/auth/[...nextauth]`

#### `GET` / `POST`

This is the main NextAuth.js handler that manages all session-related functionality, including:

-   **OAuth Sign-in:** Handling callbacks from providers like Google, GitHub, etc.
-   **Credentials-based Sign-in:** Internally uses the `/api/auth/login` logic.
-   **Session Management:** Creating, reading, and updating user sessions.
-   **Sign-out:** Invalidating user sessions.

This endpoint is not meant to be called directly from the client-side application in most cases. Instead, you should use the `signIn`, `signOut`, and `useSession` utilities provided by NextAuth.js.

For more details, refer to the NextAuth.js documentation and the configuration in `app/lib/auth.ts`.