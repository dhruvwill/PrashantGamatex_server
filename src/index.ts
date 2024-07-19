import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import constRouter from "./routes/constRouter";
import { noCache } from "./middleware/preventCache";
import multer from "multer";
import path from "path";

const app: Express = express();
const port = process.env.PORT || 3000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder
    cb(
      null,
      `C:\\Program Files (x86)\\Nutec Infotech Pvt Ltd\\DigitalSignaturePdfFile\\CRM`
    );
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
