import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./route/userRoute.js";
import {DBConnection} from "./db/db.js"

dotenv.config();

const app = express();
const port = 4000;
const corsOptions = {
    origin: ["http://localhost:5173", "http://192.168.56.1:5173"], // Add allowed origins
    credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

DBConnection();

app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
