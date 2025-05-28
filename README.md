# G05-Plant2Gather

### Tech stack:
- Frontend: React (bun)
- Backend: Hono (bun)
- Database: PostgreSQL (prisma)

### Project Setup Instructions

**Note:** you can not run both frontend and backend properly if you don't have proper environment variable (such as prisma, google map, cloudinary, etc.) in **.env** which **we are not provided because it security reasons** but **if** you are our collaborators the website will work just fine.

**Make sure [Bun](https://bun.sh/)** is installed on your system before proceeding. You can install it by following the instructions on the official Bun website.

---

## Frontend Setup

1. **Clone the Repository**
   Open your terminal and clone the project repository:

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the Frontend Directory**

   ```bash
   cd frontend
   ```

3. **Install Dependencies**

   ```bash
   bun install
   ```

4. **Start the Development Server**

   ```bash
   bun run dev
   ```

---

## Backend Setup

1. **Navigate to the Backend Directory**
   If you already cloned the repository:

   ```bash
   cd backend
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Start the Backend Server**

   ```bash
   bun run dev
   ```

---

Everything should be up and running now! Make sure both frontend and backend servers are running concurrently for full functionality.

---

### important:

> #### DO NOT PUSH TO MAIN.
>
> I have provided the Git documentation on Miro and necessary infomation. Please visit and read it to avoid any issues.

---

# CRUD Operations
Sure! Here's a clean and professional `README.md` API documentation table for the `userRoutes` endpoints:

---

# 🌱 Plant Tracker API

This API allows users to manage their plants, posts, and user profiles.

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| POST   | `api/add-plant`          | Add a new plant                       |
| POST   | `api/post`               | Create a new post                     |
| GET    | `api/get-plants/:id`     | Get all plants for a user             |
| GET    | `api/plant/:id`          | Get details of a plant by ID          |
| GET    | `api/get-user/:id`       | Get user profile by ID                |
| GET    | `api/posts`              | Retrieve all posts                    |
| GET    | `api/streak/:id`         | Get watering streak for a plant       |
| GET    | `api/latest-watered/:id` | Get the latest watered date for plant |
| PUT    | `api/update-user/:id`    | Update user profile                   |
| PUT    | `api/update-plant/:id`   | Update plant information              |
| DELETE | `api/deletePlant`        | Delete a plant                        |
| POST   |  `/login`             | Login to website                      |
| POST   |  `/register`          | Register account                      |

---

