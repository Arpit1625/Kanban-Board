# Kanban Board Project

## Features
✔️ User authentication  
✔️ Board & Column management  
✔️ Task assignment with status & due date  
✔️ Drag & drop tasks  
✔️ Board member invitations  

## Tech Stack
- Node.js + Express (Backend)
- React (Frontend)
- MongoDB (Database)

## Setup Instructions

### 1. Backend
```bash
cd backend
npm install
Create a .env file in backend:

ini
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/kanban
JWT_SECRET=your_secret_key
2. Frontend
bash
Copy
Edit
cd frontend
npm install
npm start
3. Database
Ensure MongoDB is running locally:

bash
Copy
Edit
mongod
You can access your DB at:

bash
Copy
Edit
mongodb://localhost:27017/kanban
4. Run the Project
Start the backend:

bash
Copy
Edit
npm start
Start the frontend in a separate terminal:

bash
Copy
Edit
npm start
