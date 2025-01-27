# E-learning Platform API

This project involves building a comprehensive e-learning application where users can browse and enroll in courses, manage their accounts, and interact with instructors. The platform aims to provide a seamless experience for both learners and educators.

## Features

- **User Profiles**: Create and manage user profiles with customizable information.
- **Browsing and Searching for Courses**: Browse a catalog of courses, search for courses by keywords, and apply filters.
- **Enrolling and Completing Courses**: Enroll in available courses and complete courses by finishing all modules and assignments.
- **Managing Assignments and Exams**: Users can submit assignments for their enrolled courses, take exams, receive grades, and view feedback for assignments and exams.
- **Viewing Learning History and Certificates**: View their learning history, including enrolled, in-progress, and completed courses. View and download certificates for completed courses.
- **Instructor Features**: Instructors can add, update, and delete courses, including managing course content and availability. Instructors can manage student enrollments, track progress, provide feedback, grade assignments, and manage grades.

## Getting Started

### Prerequisites

- **Node.js** (>= v14.x.x)
- **npm** or **yarn** or **pnpm**
- **MongoDB** for data storage
- **PostgreSQL** for data storage  
- **Docker** (optional, for containerized environments)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/techlateef/e-learning-api.git
   cd e-learning-api
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory and define the required environment variables:

   ```txt
   DATABASE_URL=mongodb://localhost:27017/elearning
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. Start the server:

   ```bash
   pnpm run build
   pnpm run start
   ```

   The API should now be running on `http://localhost:3000`.

## API Endpoints

Here's an overview of the main API endpoints:

### User Profile
- `POST /api/users` - Register a new user.
- `GET /api/users/:id` - Retrieve user profile details.
- `PUT /api/users/:id` - Update user profile information.

### Courses
- `GET /api/courses` - Retrieve a list of all courses.
- `POST /api/courses` - Create a new course (Instructor only).
- `GET /api/courses/:id` - Retrieve a single course's details.
- `PUT /api/courses/:id` - Update course details (Instructor only).
- `DELETE /api/courses/:id` - Delete a course (Instructor only).

### Assignments & Exams
- `POST /api/assignments` - Create a new assignment for a course (Instructor only).
- `GET /api/assignments/:id` - Get assignment details.
- `POST /api/exams` - Create a new exam for a course (Instructor only).
- `GET /api/exams/:id` - Get exam details.

## Built With

- **Node.js** - JavaScript runtime
- **Typescript** - Type-safe language for Node.js
- **Express** - Web framework for Node.js
- **PostgreSQL** - Database for storing user, post, and interaction data
- **MongoDB** - Database for course content and assignments
- **Jest** - Testing framework (jet)

## Contributing

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests.

### Commit Message Format

To maintain consistency in our version control system, all commit messages should follow the **Conventional Commit** format:

- `feat`: A new feature for the user.
- `fix`: A bug fix for the user.
- `docs`: Documentation changes.
- `style`: Formatting, missing semi colons, etc.; no code change.
- `refactor`: Refactoring production code, e.g. renaming a variable.
- `test`: Adding or updating tests.
- `chore`: Changes to the build process or auxiliary tools and libraries.

### Examples:

- `feat(auth): add login and signup routes`
- `fix(user): resolve bug with user profile update`
- `docs: update README with environment variable setup`


