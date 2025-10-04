import express, { Express, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import constRouter from "./routes/constRouter";
import { noCache } from "./middleware/preventCache";
import { NotificationSchedulerService } from './services/NotificationSchedulerService';
import { ExpoPushNotificationService } from "./services/ExpoMessagingService";

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

// Initialize notification scheduler
const setupNotificationScheduler = () => {
  const messagingService = new ExpoPushNotificationService();
  const schedulerService = new NotificationSchedulerService(messagingService);
  
  schedulerService.initialize();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('Stopping notification scheduler...');
    schedulerService.stopAllTasks();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Stopping notification scheduler...');
    schedulerService.stopAllTasks();
    process.exit(0);
  });
  
  return schedulerService;
};

// routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/const", constRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TS Server Prasad Group");
});

// Initialize the server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  
  const scheduler = setupNotificationScheduler();
  console.log('Notification scheduler is running');
});
