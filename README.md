# Blog Stack

Blog Stack is a full-stack blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides user authentication, blog creation, editing, and management features, with a modern frontend and secure backend API.

## Features

- User authentication (signup, login, logout, email verification)
- Create, edit, and delete blog posts
- View all blogs and individual blog posts
- User profile management
- Drafts and published posts
- Responsive and modern UI
- Protected routes for authenticated users 
- Email notifications for account verification
- Secure JWT-based authentication
- Cloudinary integration for image uploads
- Session management for user sessions

## Tech Stack

- **Frontend:** React, Vite, CSS Modules
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, Cookies and Sessions
- **Other:** dotenv, CORS, cookie-parser

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/vardhan-ganugula/blog-stack
   cd blog-stack
   ```

2. **Install server dependencies:**
   ```sh
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```sh
   cd ../client
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the `server` directory with the following:
     ```env
     NODE_ENV=development
     PORT=8080
     JWT_SECRET=anythingyouwant
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=465
     SMTP_USER=user@gmail.com
     SMTP_SECURE=true
     SMTP_PASS=password
     CLIENT_URL=http://localhost:5173
     DB_URL=mongodb://localhost:27017/yourdbname
     CLOUDINARY_CLOUD_NAME=cloudinaryname
     CLOUDINARY_API_SECRET=cloudinarysecret
     CLOUDINARY_API_KEY=cloudinarykey
     ```
   - Create a `.env` file in the `client` directory with the following:
     ```env
     MODE=development
     VITE_API_URL=http://localhost:8080/api 
     VITE_APP_TITLE='Retro'
     ```
### Running the Application

#### Development

- **Start the backend server:**
  ```sh
  cd server
  npm run dev
  ```

- **Start the frontend client:**
  ```sh
  cd client
  npm run dev
  ```

- The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8080` (or your specified port).

#### Production

- Build the frontend:
  ```sh
  cd client
  npm run build
  ```
- Serve the frontend from the backend by setting `NODE_ENV=production` and starting the server:
  ```sh
  cd server
  npm start
  ```

## Project Structure

```
blog-stack/
├── client/         # React frontend
├── server/         # Express backend
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── schema/
│   ├── services/
│   └── index.js
├── README.md
```

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/verify-email` - Verify user email
- `POST /api/auth/send-verification-email` - send verification email
- `GET /api/profile` - Get user profile (protected)
- `GET /api/profile` - Get user Sessions (protected)
- `GET /api/blogs/drafts` - Get user blog drafts (protected)
- `GET /api/blogs` - Get all blog posts
- `POST /api/blogs/publish` - Publish the blog post
- `POST /api/blogs/save-draft` - Save the blog post as a draft
- `GET /api/blogs/:id` - Get a single blog post


## Environment Variables for React App

- `PORT` - Port for the backend server
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT authentication
- `NODE_ENV` - Set to `development` or `production`

