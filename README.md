# Full-Stack Task Manager Application

![License](https://img.shields.io/badge/license-MIT-green)
![Go Version](https://img.shields.io/badge/Go-1.20-blue)
![React Version](https://img.shields.io/badge/React-19.1.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-yellow)

## Description

This is a full-stack task management application designed to help users organize and track their tasks efficiently. The application features a RESTful API backend and a modern, responsive frontend. Key features include:

- User authentication and authorization (JWT-based authentication).
- CRUD operations for tasks.
- Responsive UI built with React and Tailwind CSS.
- PostgreSQL database for reliable data storage.
- API integration for seamless communication between frontend and backend.

## Tech Stack

### Backend
- **Language**: Golang (Go)
- **Framework**: [Echo](https://echo.labstack.com/) (or replace with actual framework if different)
- **Database**: PostgreSQL
- **Authentication**: JWT
- **ORM**: GORM

### Frontend
- **Bundler**: Vite
- **Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint
- **Logger**: Zerolog (backend)

## Project Structure

### Backend (`/server`)

```
server
├── cmd
│   └── task-manager
│       └── main.go          # Entry point of the application
├── config                    # Configuration files
├── internal                  # Internal packages
│   ├── auth                  # Authentication logic
│   ├── handler               # HTTP handlers
│   ├── middleware            # HTTP middleware
│   ├── model                 # Database models
│   ├── repository             # Data access layer
│   └── service               # Business logic
├── scripts                   # Scripts for setup, migration, etc.
├── test                      # Test files
└── go.mod                   # Go module file
```

### Frontend (`/client`)

```
client
├── public                    # Public assets
│   ├── index.html            # Main HTML file
│   └── vite.svg              # Vite logo
├── src
│   ├── assets                # Images, fonts, etc.
│   ├── components            # React components
│   ├── hooks                 # Custom React hooks
│   ├── pages                 # Page components
│   ├── services              # API service calls
│   ├── styles                 # Global styles
│   ├── App.tsx               # Main App component
│   └── main.tsx              # Entry point for React
├── .env                      # Environment variables
├── index.html                # Main HTML file
├── package.json              # npm package file
└── vite.config.ts            # Vite configuration
```

## Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Go](https://golang.org/) (v1.20+)
- [PostgreSQL](https://www.postgresql.org/) (v14+)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/task-manager.git
   cd task-manager
   ```
2. **Set up the backend**:
   - Install Go dependencies:
     ```bash
     cd server
     go mod download
     ```
   - Set up the database:
     - Create a new PostgreSQL database and user.
     - Update the database configuration in `server/config`.
     - Run migrations (if any) using the appropriate command or tool.
3. **Set up the frontend**:
   - Install npm dependencies:
     ```bash
     cd client
     npm install
     ```
   - Update the API base URL in the frontend environment variables (e.g., `.env` file).
4. **Run the application**:
   - Start the backend server:
     ```bash
     cd server
     go run cmd/task-manager/main.go
     ```
   - In a new terminal, start the frontend development server:
     ```bash
     cd client
     npm run dev
     ```
5. **Access the application**:
   - Open your browser and go to `http://localhost:3000` (or the appropriate port).

## Environment Variables
### Backend (server/.env)
| Variable       | Description                     | Example Value       |
|----------------|---------------------------------|---------------------|
| DB_HOST        | Database host                   | localhost            |
| DB_PORT        | Database port                   | 5432                |
| DB_USER        | Database username                | postgres             |
| DB_PASSWORD    | Database password                | password             |
| DB_NAME        | Database name                   | task_manager         |
| JWT_SECRET     | Secret key for JWT             | your_secret_key      |

### Frontend (client/.env)
| Variable             | Description                        | Example Value                |
|----------------------|------------------------------------|------------------------------|
| VITE_API_BASE_URL   | Base URL for API requests         | http://localhost:8080/api/v1  |

## API Documentation
### Example Endpoints
- **GET** `/api/v1/tasks`
  - Description: Fetch all tasks.
  - Response:
- **POST** `/api/v1/tasks`
  - Description: Create a new task.
  - Request:
  - Response:

## Usage Instructions
- **Run Backend**:
- **Run Frontend**:
- **Run Tests**:
  - Backend: Use `go test ./...` in the server directory.
  - Frontend: Use `npm test` in the client directory (if tests are configured).

## Database Schema
### Tasks Table
| Column        | Type         | Constraints      |
|---------------|--------------|------------------|
| id            | SERIAL       | Primary Key      |
| title         | VARCHAR(255) | Not Null         |
| completed     | BOOLEAN      | Default: false   |
| created_at    | TIMESTAMP    | Default: NOW()   |

## Troubleshooting / FAQs
### Common Issues
- **Database connection error**:
  - Ensure PostgreSQL is running and .env variables are correctly configured.
- **Frontend not connecting to backend**:
  - Verify VITE_API_BASE_URL in the frontend .env file matches the backend URL.

## Contributing Guide
We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear messages.
4. Submit a pull request.

## License
This project is licensed under the MIT License.

## Contact / Author Info
- **Author**: Your Name
- **Email**: your.email@example.com
- **GitHub**: your-github-profile