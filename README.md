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
cd backend
npm install

Create a .env file in backend:
PORT=5000
MONGO_URI=mongodb://localhost:27017/kanban
JWT_SECRET=your_secret_key

###2. Frontend
cd frontend
npm install
npm start

###3. Database
Ensure MongoDB is running locally:
mongod
You can access your DB at:
mongodb://localhost:27017/kanban

###4. Run the Project
Start the backend:
npm start
Start the frontend in a separate terminal:
npm start
