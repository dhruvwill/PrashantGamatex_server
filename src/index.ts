import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import constRouter from "./routes/constRouter";
import { noCache } from "./middleware/preventCache";
import multer from "multer";

const app: Express = express();
const port = process.env.PORT || 3000;
const upload = multer({
  dest: "uploads/",
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(noCache);
app.use(upload.any());

// routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/const", constRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TS Server Prasad Group");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
