# JobTracker

| Feature                              | Description & Resume Showcase                                                                                                          |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **User Authentication**              | Signup/login with JWT/session-based auth. Show security best practices, token management, password hashing (bcrypt).                   |
| **Add Job Manually**                 | CRUD operations on job entries. Show RESTful API design, DB schema, input validation.                                                  |
| **Add Job via URL (Smart Scraping)** | Accept URL → backend scrapes data → auto-fill job details. Demonstrate Puppeteer/Playwright scraping, async API calls, error handling. |
| **Job Status Tracking**              | Track application stages: applied, phone screen, interview, offer, rejected. Show state management and DB schema relationships.        |
| **Notes & Reminders**                | Add/edit notes per job, set reminders for follow-ups. Highlight data modeling and notification scheduling.                             |
| **Dashboard & Filters**              | View/filter jobs by status, company, deadlines. Demonstrate frontend state management, pagination, search.                             |
| **Export Data**                      | Export job data as CSV or PDF reports. Showcase backend data formatting and file streaming.                                            |
| **Responsive UI & Mobile Ready**     | Responsive React frontend + React Native compatibility. Emphasize cross-platform design.                                               |
| **Browser Extension (Bonus)**        | Chrome extension to auto-capture job info from pages. Show integration with backend APIs and token-based auth.                         |


| Table Name  | Fields (examples)                                                                                                             | Purpose                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `users`     | id (PK), email, password\_hash, created\_at                                                                                   | Store user credentials    |
| `jobs`      | id (PK), user\_id (FK), title, company, location, url, description, status, applied\_date, deadline, created\_at, updated\_at | Job applications per user |
| `notes`     | id (PK), job\_id (FK), content, created\_at, updated\_at                                                                      | Notes linked to job       |
| `reminders` | id (PK), job\_id (FK), reminder\_date, message, is\_completed                                                                 | Reminders for follow-ups  |


| Endpoint          | Method   | Description                         |
| ----------------- | -------- | ----------------------------------- |
| `/auth/signup`    | POST     | Register new user                   |
| `/auth/login`     | POST     | Login, get JWT token                |
| `/jobs`           | GET      | List jobs for user                  |
| `/jobs`           | POST     | Add new job (manual or URL)         |
| `/jobs/:id`       | GET      | Get job details                     |
| `/jobs/:id`       | PUT      | Update job info/status              |
| `/jobs/:id`       | DELETE   | Delete job                          |
| `/jobs/scrape`    | POST     | Submit job URL, return scraped data |
| `/jobs/:id/notes` | GET/POST | List/add notes for job              |
| `/reminders`      | GET/POST | List/add reminders                  |
| `/export`         | GET      | Export jobs data as CSV/PDF         |


| Component          | Purpose                         |
| ------------------ | ------------------------------- |
| `LoginForm`        | User login                      |
| `SignupForm`       | User registration               |
| `JobList`          | List all jobs with filters      |
| `JobForm`          | Add/edit job (manual or URL)    |
| `JobDetails`       | View job info, notes, reminders |
| `NotesSection`     | Add/edit notes                  |
| `RemindersSection` | View/add reminders              |
| `ExportButton`     | Export job data                 |
| `Dashboard`        | Main overview page              |
