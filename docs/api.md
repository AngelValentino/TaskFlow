# API Documentation

## Base URL

`https://api.taskflowapp.net`

<br>

## Authentication

For authenticated routes, the API uses **Bearer Authentication** tokens, specifically **JWT** (JSON Web Tokens). For password reset functionality, a separate JWT token is used.

Each token has at least the following characteristics:
- **Type**: Tokens are assigned a specific type to prevent misuse.
- **Expiration Time**: Tokens have a defined expiration time to limit their validity.
- **Signature**: All tokens are securely signed using a secret key on the server, ensuring the integrity of the payload and verifying that it has not been tampered with.

Among all the routes, the only one that requires authentication is the `/quotes` route.

### Authentication Flow

#### Login

- The user submits credentials (username and password).
- The backend validates the credentials and generates two JWTs: an **access token** (expires in 5 minutes) and a **refresh token** (expires in 5 days).
- The tokens are sent to the client, which stores them for use in subsequent requests to protected routes.

#### Authenticated Requests

- Client includes access token in the `Authorization` header:  
  `Authorization: Bearer <token>`
- The `Auth::authenticateAccessToken()` method decodes and validates the token, and extracts user info.

#### Refresh Token

- When the access token expires, the client sends a request to the `/refresh` route with the refresh token.
- The backend verifies the refresh token, issues a new access token and refresh token, and updates the `refresh_tokens` column in the database.

#### Logout

- The client sends a logout request to the `/logout` route with the current refresh token.
- The backend clears the token from the database, and the client clears theirs 
respectively, effectively invalidating the session.

#### Password Recovery

- If a user forgets their password, they can request a reset link by providing their email.
- The system sends an email with a link (valid for 10 minutes) allowing them to set a new password.
- The reset link includes a JWT to securely validate the request and prevent misuse.

<br>

## Rate Limiting

### Overview

Rate limiting helps protect the API from abuse by restricting how many requests the client can make in a period of time. If the user exceeds the limit, they are temporarily blocked.

This system uses **Redis** with the **Predis** PHP client (a pure PHP solution that doesn't require installing any PHP extensions).

### How It Works

The `RateLimiter` class tracks and controls client behavior:

- **Request Counting**: Each request increases a Redis counter tied to the client's IP, device ID, and the endpoint being accessed.
- **Blocking**: If the number of requests exceeds the allowed threshold, the client receives a `429 Too Many Requests` error and is blocked for a set time.
- **Rotation Detection**: The system also tracks frequent changes in IP addresses or device IDs to prevent abuse by rotation. If excessive switching is detected, the client is blocked.

### Workflow Summary

- When a request comes in:
   - The request count is checked.
   - If under the limit, the request is allowed and the counter is incremented.
   - If over the limit, a 429 error is returned and the client is temporarily blocked.

- Additional protections:
   - Device ID rotation detection blocks IPs that keep switching device IDs.
   - IP rotation detection blocks devices that keep changing IPs.

### Endpoint Rate Limits

| Endpoint              | Max Requests | Time Window | Block Duration |
|-----------------------|--------------|-------------|----------------|
| `/register`           | 5            | 1 minute    | 1 minute       |
| `/login`              | 5            | 1 minute    | 1 minute       |
| `/logout`             | 5            | 1 minute    | 1 minute       |
| `/refresh`            | 1            | 4 minutes   | 4 minutes      |
| `/recover-password`   | 5            | 1 minute    | 1 minute       |
| `/reset-password`     | 10           | 1 minute    | 1 minute       |
| `/tasks`              | 50           | 1 minute    | 1 minute       |
| `/tasks/{id}`         | 50           | 1 minute    | 1 minute       |
| `/quotes`             | 1            | 1 minute    | 1 minute       |

<br>

## Maintenance Mode

This API supports a simple maintenance mode controlled via a Bash script.

When the script creates a file named `maintenance.flag` in the project root, the API will return a **503 Service Unavailable** response for all incoming requests.

This feature is primarily intended for:
- Performing scheduled maintenance
- Blocking access during security incidents (e.g. DDoS attacks or suspicious activity)

Removing the `maintenance.flag` file restores normal API operation.

<br>

## Error Handling and Auditing

The API uses a centralized error handler to manage and log errors effectively. When an error occurs, the `ErrorHandler` class logs it in a file inside the `/logs` folder and returns a standard JSON error response to the client. 

### Error Handling

When an error occurs, the API will respond with a generic **500 Internal Server Error** and a JSON message. Afterwards, it will log the error on the server, including details such as the error message, file, and line number, which are logged for auditing purposes. Log rotation is configured to manage space.

#### 500 Error Response:

```json
{
    "message": "An internal server error occurred. Please try again later."
}
```

### Auditing

All significant errors and activities (such as invalid IP addresses or other important events) are logged in the `audit.log` file. These logs help in tracking suspicious activity and debugging.

#### Example Audit Log:

```
[2025-05-12 15:30:00] AUDIT: INVALID_IP -> IP 192.168.0.1 was blocked in production environment
```

### Specific API Responses

- **500 Internal Server Error**: An unexpected error occurred on the server.
- **503 Service Unavailable**: Service is currently undergoing maintenance.
- **403 Forbidden**: Invalid IP address or CORS-related issues.
- **400 Bad Request**: Device ID not provided in the request.
- **401 Unauthorized**: Incorrect device ID format (not a valid UUID).
- **429 Too Many Requests**: Rate limit exceeded; too many requests in a given time frame.

<br>

## CORS (Cross-Origin Resource Sharing)

The API allows CORS for requests with the following headers:

| Header            | Description                |
|-------------------|----------------------------|
| `Content-Type`    | Specifies the content type of the request. |
| `Authorization`   | Used for sending authentication credentials (e.g., Bearer token). |
| `X-Device-ID`     | Identifies the device making the request. |

### Allowed HTTP Methods:

| Method    | Description                                       |
|-----------|---------------------------------------------------|
| `GET`     | Retrieve data from the database via the API.      |
| `POST`    | Submit new data to be added to the database via the API. |
| `PATCH`   | Modify existing data in the database via the API. |
| `DELETE`  | Remove data from the database via the API.        |
| `OPTIONS` | Preflight request to check CORS permissions.      |

<br>

## Environment

This API is deployed across different environments to support both development and production workflows.

### Development:

- **Access**: Restricted to `localhost` (IP: `127.0.0.1` or `::1`).
- **Purpose**: Designed for local development and testing purposes.

### Production:
- **Access**: Available to all valid IP addresses, excluding private IP ranges.
- **Purpose**: Intended for live, production use, and publicly accessible.

To manage environment-specific configurations, the application utilizes a `.env` file in conjunction with the **PHP dotenv** library. This approach allows us to securely handle sensitive information, such as API keys and database credentials, without hardcoding them in the source code. The `.env` file contains values for both development and production environments, and **PHP dotenv** loads these variables at runtime, ensuring that the correct configuration is used for each environment.

<br>

## Endpoints

### Register User

| **Field**           | **Value**                                                                |
|---------------------|--------------------------------------------------------------------------|
| **Endpoint**        | `/register`                                                              |
| **Allowed Methods** | `POST`                                                                   |
| **Headers**         | `Content-Type: application/json`<br>`X-Device-ID: UUID`                  |
| **Description**     | Validates the client's request, registers a new user account, and sends a welcome email upon successful registration. |

#### JSON examples

##### Request Body

```json
{
    "email": "jack@mail.com",
    "password": "password1234",
    "confirm_password": "password1234"
}
```
- **email:** The user's email address (required).
- **password:** The user's password (required).
- **confirm_password:** A confirmation of the user's password (required).

##### 422 Unprocessable Entity

For an error to be cleared, it must be sent with a value of `null`.

```json

{
    "errors": {
        "username": null,
        "email": "Email is already registered.",
        "password": "Password must be at least 8 characters long.",
        "repeated_password": "Passwords do not match.",
        "terms": "You must accept terms and conditions in order to register."
    }
}
```

#### Specific Endpoint Response

- **201 Created:** Successful registration process.
- **405 Method Not Allowed:** Invalid method used.
- **422 Unprocessable Entity:** Validation errors.

### Login

| **Field**           | **Value**                                                                |
|---------------------|--------------------------------------------------------------------------|
| **Endpoint**        | `/login`                                                                 |
| **Allowed Methods** | `POST`                                                                   |
| **Headers**         | `Content-Type: application/json`<br>`X-Device-ID: UUID`                  |
| **Description**     | Validates the login request, authenticates the user, and returns JWT access and refresh tokens to the client, with protections in place to prevent timing attacks and user enumeration. |

#### JSON Examples

##### Request Body

```json
{
    "email": "jack@email.com",
    "password": "password1234"
}
```

- **email:** The user's email address (required).
- **password:** The user's password (required).

##### Response body

```json
{
    "access_token": "<access_token>",
    "refresh_token": "<refresh_token>",
    "username": "jackdurden"
}
```

#### Specific Endpoint Response

- **200 OK:** Successul login process.
- **401 Unauthorized:** Invalid credentials.
- **405 Method Not Allowed:** Invalid method used.

### Logout

| **Field**           | **Value**                                                                |
|---------------------|--------------------------------------------------------------------------|
| **Endpoint**        | `/logout`                                                                |
| **Allowed Methods** | `POST`                                                                   |
| **Headers**         | `Content-Type: application/json`<br>`X-Device-ID: UUID`                  |
| **Description**     | Logs out a user by removing the refresh token from the database and instructs the client to clear any stored tokens. |

#### Request Body

```json
{
    "token": "<refresh_token>"
}
```

- **token:** The user's refresh token (required).

#### Specific Endpoint Response

- **204 No Content:** Successfully logged out.
- **400 Bad Request:** 
  - Missing token.
  - Invalid token.
  - Invalid token type.
- **401 Unauthorized:** 
  - Invalid user.
  - Invalid token signature
  - Expired token.
- **405 Method Not Allowed:** Invalid method used.

### Refresh Token

| **Field**           | **Value**                                                                |
|---------------------|--------------------------------------------------------------------------|
| **Endpoint**        | `/refresh`                                                               |
| **Allowed Methods** | `POST`                                                                   |
| **Headers**         | `Content-Type: application/json`<br>`X-Device-ID: UUID`                  |
| **Description**     | Refreshes the user's access and refresh tokens using the provided refresh token. |

#### JSON Examples

##### Request body

```json
{
    "token": "<refresh_token>"
}
```
- **token:** The user's refresh token (required).

##### Response body

```json
{
    "access_token": "<access_token>",
    "refresh_token": "<refresh_token>",
    "username": "jackdurden"
}
```

#### Specific Endpoint Response

- **200 OK:** User tokens refreshed successfully.
- **400 Bad Request:** 
  - Missing token.
  - Invalid token.
  - Invalid token type.
- **401 Unauthorized:** 
  - Invalid user.
  - Invalid token signature
  - Expired token.
- **405 Method Not Allowed:** Invalid method used.

### Recover Password

| **Field**           | **Value**                                                                 |
|---------------------|---------------------------------------------------------------------------|
| **Endpoint**        | `/recover-password`                                                       |
| **Allowed Methods** | `POST`                                                                    |
| **Headers**         | `Content-Type: application/json`<br>`X-Device-ID: UUID`                   |
| **Description**     | Validates the provided email and sends a password recovery link to the user's email address, with protections in place to prevent timing attacks and user enumeration. |

#### JSON Examples

##### Request Body

```json
{
    "email": "jack@mail.com"
}
```

- **email:** The user's valid account email (required).

##### 422 Unprocessable Entity

For an error to be cleared, it must be sent with a value of `null`.

```json

{
    "errors": {
        "email": "Enter a valid email address."
    }
}
```

#### Specific Endpoint Response

- **200 OK:** Recovery email sent.
- **400 Bad Request:** Missing email.
- **405 Method Not Allowed:** Invalid method used.
- **422 Unprocessable Entity:** Validation errors.

### Reset Password

| **Field**           | **Value**                                                                                           |
|---------------------|-----------------------------------------------------------------------------------------------------|
| **Endpoint**        | `/reset-password`                                                                                   |
| **Allowed Methods** | `POST`                                                                                              |
| **Headers**         | `Content-Type: application/json`<br>`X-Device-ID: UUID`                                             |
| **Description**     | Validates the reset token and updates the user's password as part of the recovery process.          |

#### JSON Examples

##### Request Body

```json
{
    "token": "<reset_token>",
    "new_password": "newpassword1234"
}
```

- **token:**  The user's refresh token (required).
- **new_password:** The user's new password (required).

##### 422 Unprocessable Entity

For an error to be cleared, it must be sent with a value of `null`.

```json

{
    "errors": {
        "password": "Password must be at least 8 characters long.",
        "repeated_password": "The passwords entered do not match." 
    }
}
```

#### Specific Endpoint Response

- **200 OK:** Password reset successful.
- **400 Bad Request:**   
  - Missing token.
  - Invalid token.
  - Invalid token type.
- **401 Unauthorized:** 
  - Invalid token signature
  - Expired token.
- **405 Method Not Allowed:** Invalid method used.
- **422 Unprocessable Entity:** Validation errors.

### Tasks

| **Field**           | **Value**                                                                                                                                         |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| **Endpoint**        | `/tasks`                                                                                                                                          |
| **Allowed Methods** | `GET` / `POST` / `DELETE`                                                                                                                         |
| **Headers**         | `Content-Type: application/json`<br>`X-Device-ID: UUID`<br>`Authorization: Bearer <access_token>`                                                |
| **Query Parameters** *(GET only)* | **completed** (boolean, optional): Filter tasks by completion status (true or false).<br>**title** (string, optional): Filter by title keyword.<br>**counter** (boolean, optional): If true, return only the number of tasks instead of the tasks array. |
| **Description**     | **GET**: Retrieve tasks for the authenticated user. Optional filters available.<br>**POST**: Create a new task for the authenticated user.<br>**DELETE**: Delete all tasks, or conditionally delete by completion status. |


#### JSON Examples

##### GET Response Body

```JSON
[
  {
    "id": 3,
    "title": "Ask your houseplants about their weekend plans",
    "due_date": "2025-06-05",
    "description": "Get in touch with your houseplants on a deeper level. Ask them about their weekend plans. Are they going out? What’s on their agenda? Do they want to meet some new plants?",
    "is_completed": true
  },
  {
    "id": 4,
    "title": "Prepare for the emotional farewell of your houseplants going abroad",
    "due_date": "2025-06-10",
    "description": "Your houseplants have made it clear they’re moving on to greener pastures, literally. They’re off to work abroad or find a new better life. Give them a proper send-off. Help them pack their tiny plant bags and offer advice on surviving in the wild, your friend’s balcony.",
    "is_completed": false,
  }
]
```

##### GET Response Body (counter = true)

```
2 (task count)
```

##### POST Request Body

```JSON
{
  "title": "The Office Plant Whisperer",
  "due_date": "2025-06-21",
  "description": "Check on the office plants. Water them if they’re still alive, or quietly place your hands together and whisper a prayer to the plant gods for the ones that are not."
}
```

- **title:** Task title (required).
- **due_date:** Task due date (required).
- **description:** Task description (optional).

##### 422 Unprocessable Entity

For an error to be cleared, it must be sent with a value of `null`.

```json

{
    "errors": {
        "title": "Title field is required.",
        "due_date": "Due date must be in YYYY-MM-DD format and also be valid.",
        "description": "Description must be less than or equal 500 characters."
    }
}
```

#### Specific Endpoint Response

- **200 OK:** Tasks retrieved successfully.
- **201 Created:** Task created successfully.
- **204 No content:** Tasks deleted successfully.
- **400 Bad Request:**   
  - Incomplete authorization header.
  - Invalid token.
  - Invalid token type.
- **401 Unauthorized:** 
  - Invalid token signature
  - Expired token.
- **405 Method Not Allowed:** Invalid method used.
- **409 Conflict:** Max active task limit (100) reached.
- **422 Unprocessable Entity:** Validation errors.

### Task by ID

| **Field**           | **Value**                                                                                                                                         |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| **Endpoint**        | `/tasks/{id}`                                                                                                                                     |
| **Allowed Methods** | `GET` / `PATCH` / `DELETE`                                                                                                                         |
| **Headers**         | `Content-Type: application/json`<br>`X-Device-ID: UUID`<br>`Authorization: Bearer <access_token>`                                                |
| **Description**     | **GET**: Retrieve the task specified by ID for the authenticated user.<br>**PATCH**: Update specific fields of the task with the given ID, such as completing a task.<br>**DELETE**: Delete the task with the specified ID. |

#### JSON Examples

##### GET Response Body

```JSON
{
    "id": 7,
    "title": "Teach your pet rock how to roll",
    "due_date": "2025-06-05",
    "description": "Take your pet rock to the next level by teaching it how to roll. Start with basic movements and work your way up to advanced tricks.",
    "is_completed": true
}
```

##### PATCH Request Body

```JSON
{
    "title": "Wake up at 4 AM and stare into the abyss",
    "due_date": "2025-07-01",
    "description": "Rise at 4 AM and gaze into the abyss. Feel the cold void stare back at you as you assert your dominance over time itself.",
    "is_completed": true
}
```

- **title:** Task title (optional).
- **due_date:** Task due date (optional).
- **description:** Task description (optional).
- **is_completed:** Task completion status (optional).

##### 422 Unprocessable Entity

For an error to be cleared, it must be sent with a value of `null`.

```json

{
    "errors": {
        "title": "Title field is required.",
        "due_date": "Due date must be in YYYY-MM-DD format and also be valid.",
        "description": "Description must be less than or equal 500 characters."
    }
}
```
#### Specific Endpoint Response

- **200 OK**: Task retrieved successfully.
- **204 No Content**: Task updated or deleted successfully.
- **400 Bad Request:**   
  - Incomplete authorization header.
  - Invalid token.
  - Invalid token type.
- **401 Unauthorized:** 
  - Invalid token signature
  - Expired token.
- **404 Not Found**: Task not found.
- **405 Method Not Allowed**: Invalid method used.
- **422 Unprocessable Entity**: Validation errors.

### Quotes

| **Field**           | **Value**                                  |
|---------------------|--------------------------------------------|
| **Endpoint**        | `/quotes`                                  |
| **Allowed Methods** | `GET`                                      |
| **Headers**         | `Content-Type: application/json`<br>`X-Device-ID: UUID` |
| **Description**     | **GET**: Retrieve all quotes.             |

#### Specific Endpoint Response

- **200 OK**: List of quotes successfuly retrieved.
- **405 Method Not Allowed**: Invalid method used.