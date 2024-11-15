import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { sign } from "jsonwebtoken";
import { userloginquery } from "../queries/auth";

const authRouter = Router();
const secret: string = process.env.JWT_SECRET!;

authRouter.post("/login", setDatabaseConnection, async (req: any, res: any) => {
  try {
    const querydata = req.body;
    
    const data = await req.knex.raw(userloginquery, [req.body.user.username, req.body.user.password, req.body.user.DeviceName]);
    if (data.length > 0) {
      const payload = {
        ...data[0],
        company: req.body.user.company,
      };
      const token = sign(payload, secret, { expiresIn: "1h" });
      res.status(200).json({ payload, token });
    } else {
      res.status(401).json({ error: "Invalid Username or Password" });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Some Error Occurred" });
  }
});

export default authRouter;
