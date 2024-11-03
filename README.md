# Social Media Platform API

This project involves building a comprehensive e-learning application where users can browse and enroll in courses, manage their accounts, and interact with instructors. The platform aims to provide a seamless experience for both learners and educators.

## Features

- **User Profiles**: Create and manage user profiles with customizable information.
- **Browsing and Searching for Courses**:  browse a catalog of courses, earch for courses by keywords and apply filters.
- **Enrolling and Completing Courses**: enroll in available courses. complete courses by finishing all modules and assignments.
- **Managing Assignments and Exams**: Users can submit assignments for their enrolled courses, take exams for their enrolled courses and receive grades, view their grades and feedback for assignments and exams.
- **Viewing Learning History and Certificates**:view their learning history, including enrolled, in-progress, and completed courses. view and download certificates for completed courses.
- **Instructor Features**: Instructors can add, update, and delete courses, including managing course content and availability. Instructors can manage student enrollments, track progress, and provide feedback. Instructors can grade assignments and exams, and manage grades.

## Getting Started

### Prerequisites

- **Node.js** (>= v14.x.x)
- **npm** or **yarn**
- **MongoDB** for data storage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/techlateef/e-learning-api.git
   cd social-media-api
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory and define the required environment variables, such as `DATABASE_URL`, `JWT_SECRET`, etc.

4. Start the server:

   ```bash
   yarn run build
   yarn run start
   ```

   The API should now be running on `http://localhost:3000`.

## API Endpoints

Here's an overview of the main API endpoints:

- **User Profile**
  - `POST /api/users` - Register a new user.
  - `GET /api/users/:id` - Retrieve user profile details.
  - `PUT /api/users/:id` - Update user profile information.



## Built With

- **Node.js** - JavaScript runtime
- **Typescript** - 
- **Express** - Web framework for Node.js
- **MongoDB** - Database for storing user, post, and interaction data

## Contributing

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests.

