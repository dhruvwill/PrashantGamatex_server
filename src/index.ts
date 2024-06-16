import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TS Server Prasad Group");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
