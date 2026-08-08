const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

// CRITICAL FOR RENDER DEPLOYMENT: Trust proxy to allow HTTPS cross-site cookies
app.set("trust proxy", 1)

app.use(express.json())
app.use(cookieParser())

// Allow cookies across domains in production
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app