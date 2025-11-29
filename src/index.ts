import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import constRouter from "./routes/constRouter";
import utilityRouter from "./routes/utilityRouter";
import { noCache } from "./middleware/preventCache";
import { adminSwitchMiddleware } from "./middleware/adminSwitch";
import multer from "multer";
import path from "path";

const app: Express = express();
const port = process.env.PORT || 3000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `C:\\CRM\\`);
  },
  filename: function (req: any, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      req.user.uid + "_" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(noCache);
app.use(adminSwitchMiddleware);

// routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/const", constRouter);
app.use("/admin", utilityRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TS Server Prasad Group");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
