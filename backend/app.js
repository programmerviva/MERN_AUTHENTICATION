import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connection} from "./database/dbConnection.js"; 
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRouter.js";
import { removeUnverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
import dotenv from "dotenv";

dotenv.config(); 
export const app = express();
config({ path: "./.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);

removeUnverifiedAccounts();
connection();

app.use(errorMiddleware);