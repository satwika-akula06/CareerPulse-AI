# 🚀 CareerPulse AI — Career Readiness & Skill Analysis Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Click_Here-brightgreen?style=for-the-badge&logo=vercel)](https://career-pulse-ai-three.vercel.app)
[![Backend Status](https://img.shields.io/badge/Render_Backend-Active-blue?style=for-the-badge&logo=render)](https://careerpulse-ai-backend.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> 🌐 **Live Web Application:** [https://career-pulse-ai-three.vercel.app](https://career-pulse-ai-three.vercel.app)  
> ⚙️ **Backend Service API:** [https://careerpulse-ai-backend.onrender.com](https://careerpulse-ai-backend.onrender.com)

---

CareerPulse AI is a full-stack, AI-powered platform designed to analyze job readiness, compute match scores against target job descriptions, identify technical skill gaps, generate structured learning roadmaps and facilitate technical and behavioral practice.

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React.js (Vite)
- **Styling:** SCSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **State Management:** React Context API (`AuthContext`, `InterviewContext`)
- **Hosting:** Vercel

### Backend

- **Runtime:** Node.js & Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT), HTTP-Only Cookies, `bcryptjs`
- **AI Engine:** Groq API (`groq-sdk`)
- **File Handling:** Multer
- **Hosting:** Render

---

## ✨ Core Features

- 📊 **Job Match Score:** Evaluate candidate experience against target job descriptions to compute an overall alignment score.
- 🔍 **Skill Gap Analysis:** Identify missing technical proficiencies and domain-specific knowledge required for target roles.
- 🗺️ **AI-Generated Roadmaps:** Automatically produce step-by-step learning paths tailored to bridge identified skill gaps.
- 💡 **Technical & Behavioral Practice:** Generate role-specific technical and behavioral practice questions with real-time feedback.
- 📄 **Tailored Resume PDF Generation:** Export custom resumes formatted specifically for target job descriptions using headless Puppeteer rendering.
- 🔐 **Secure Auth & Session Management:** Cookie-based JWT authentication, client route protection, and token blacklisting on logout.

---

## 📁 Project Structure

````text
CareerPulse-AI/
├── Backend/
│   ├── src/
│   │   ├── config/          # MongoDB database connection setup
│   │   ├── controllers/     # Authentication & core business logic
│   │   ├── middlewares/     # JWT verification & Multer file handlers
│   │   ├── models/          # Mongoose schemas (User, Blacklist, Reports)
│   │   ├── routes/          # Express API route definitions
│   │   └── services/        # Groq AI service integrations
│   ├── server.js            # Database connection & server port listener
|   |__ app.js               # Express app setup, middlewares, & route mounting
│   ├── .puppeteerrc.cjs     # Puppeteer configuration for Linux hosting
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/        # Login, Register, Auth Context & API services
│   │   │   └── interview/   # Home dashboard, Practice views & styling
|   |   |__ style            # Styling button
│   │   ├── app.routes.jsx   # Client routing setup
│   │   └── main.jsx         # React application DOM entry point
|   |__ App.jsx              # Root React component and layout wrapper
│   ├── index.html
│   ├── vercel.json          # Production API proxy rewrites
│   └── package.json
│
├── .gitignore               # Root git rules protecting local secrets
└── README.md                # Project documentation

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
* [Groq API Key](https://console.groq.com/)

---

### Installation & Local Setup

#### 1. Clone the Repository
```bash
git clone [https://github.com/](https://github.com/)satwika-akula06/CareerPulse-AI.git
cd CareerPulse-AI

## 2. Backend Setup

Navigate into the backend folder and install dependencies:

```bash
cd Backend
npm install
````

Create a `.env` file inside `Backend/`:

```env
PORT=3000
MONGO_URI=mongodb+srv://satwikaakula0_db_user:<your_db_password>@interview-ai-cluster.pjyhf7h.mongodb.net/interview-master
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

## 3. Frontend Setup

In a separate terminal window, navigate into the frontend folder, install dependencies, and launch Vite:

```bash
cd Frontend
npm install
npm run dev
```

The application will run locally on [http://localhost:5173](http://localhost:5173).

## 🔒 Environment Variables Reference

| Location             | Variable       | Description                                          |
| -------------------- | -------------- | ---------------------------------------------------- |
| `Backend/.env`       | `PORT`         | Express backend server port (Default: 3000)          |
| `Backend/.env`       | `MONGO_URI`    | MongoDB Atlas Cloud connection string                |
| `Backend/.env`       | `JWT_SECRET`   | Secret key used for signing JWT auth tokens          |
| `Backend/.env`       | `GROQ_API_KEY` | Groq API key for AI evaluations & roadmap generation |
| `Backend/.env`       | `CLIENT_URL`   | Allowed CORS frontend origin                         |
| `Vercel Environment` | `VITE_API_URL` | Production backend base URL for Axios calls          |

## 🌐 Deployment Configuration

- **Frontend:** Hosted on Vercel with automatic deployment on `main` push. Uses `vercel.json` rewrites to route `/api/*` traffic cleanly and avoid cross-origin cookie restrictions.
- **Backend:** Hosted on Render using Node.js runtime and automated headless Chrome installation (`npx puppeteer browsers install chrome`) for serverless PDF exporting.

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
