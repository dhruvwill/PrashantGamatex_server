import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { sign } from "jsonwebtoken";

const authRouter = Router();
const secret: string = process.env.JWT_SECRET!;

authRouter.post("/login", setDatabaseConnection, async (req: any, res: any) => {
  console.log(req.body);
  try {
    const data = await req
      .knex("dbo.UserMaster")
      .select({
        uid: "UserCode",
        username: "UserIdentification",
        name: "Description",
      })
      .where("UserIdentification", req.body.username)
      .andWhere("Password", req.body.password);
    if (data.length > 0) {
      const payload = {
        ...data[0],
        company: req.body.company,
      };
      const token = sign(payload, secret, { expiresIn: "1h" });
      res.status(200).json({ payload, token });
    } else {
      res.status(401).json({ error: "Invalid Username or Password" });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Some Error Occured" });
  }
});

export default authRouter;
