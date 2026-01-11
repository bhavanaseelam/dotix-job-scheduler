# Dotix Job Scheduler & Automation System

This project is a simple full-stack job scheduler built as part of the Dotix Full Stack Developer assignment.

The application allows users to create background jobs, execute them manually, track their status, and automatically trigger a webhook once a job is completed.

---

## What This Project Does

- Users can create a job with a task name, payload, and priority
- Jobs are stored in a MySQL database
- Each job has a status: pending, running, or completed
- Jobs can be executed manually from the dashboard
- Job execution is simulated with a delay
- When a job completes, a webhook is triggered automatically
- All jobs are displayed in a simple dashboard UI

---

## Tech Stack Used

### Frontend
- React (Vite)
- JavaScript
- Axios

### Backend
- Node.js
- Express.js
- MySQL
- Axios (for webhook requests)

### Tools
- MySQL Workbench
- Thunder Client / Postman
- webhook.site

---

## Database Design

### jobs Table

| Column     | Description |
|-----------|------------|
| id        | Primary key (auto increment) |
| taskName  | Name of the job |
| payload   | JSON payload for the job |
| priority  | Low / Medium / High |
| status    | pending / running / completed |
| createdAt| Job creation time |
| updatedAt| Last update time |

---

## API Endpoints

### Create a Job
POST /jobs

### Get All Jobs
GET /jobs

### Get Job by ID
GET /jobs/:id

### Run a Job
POST /run-job/:id

---

## Webhook Functionality

When a job finishes execution:
- A POST request is sent to a webhook URL
- The webhook payload contains:
  - jobId
  - taskName
  - priority
  - payload
  - completedAt timestamp

Webhook testing is done using webhook.site.

---

## How to Run the Project

### Backend Setup
1. Navigate to backend folder
2. Install dependencies
3. Start the server

```bash
cd backend
npm install
node src/server.js
