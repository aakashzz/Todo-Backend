import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();

//configuration of server 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static("./public"));
app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))

//routes block
import userRouter from "./routes/user.route"
import TodoRouter from "./routes/todo.route"
app.use("/api/v1/user",userRouter)
app.use("/api/v1/todo",TodoRouter)

export {app}