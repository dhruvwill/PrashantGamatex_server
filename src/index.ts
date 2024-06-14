import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app: Express = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TS Server");
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const user = await prisma.user.findUnique({
      where: { username: username, password: password },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({
      token: "test_token",
      username: user.username,
      usercode: user.uid,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
