import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { sign } from "jsonwebtoken";

const authRouter = Router();
const secret: string = process.env.JWT_SECRET!;

authRouter.post("/login", setDatabaseConnection, async (req: any, res: any) => {
  try {
    const data = await req
      .knex("dbo.UserMaster")
      .select({
        uid: "UserCode",
        username: "UserIdentification",
        name: "Description",
        masterid: "UserMasterId",
      })
      .where("UserIdentification", req.body.user.username);

    const user = await req
      .knex("dbo.UserMasterUDF")
      .select({
        password: "CRMPasswrod",
      })
      .where("UserMasterId", data[0].masterid)
      .andWhere("CRMPasswrod", req.body.user.password);

    if (user.length > 0) {
      const payload = {
        uid: data[0].uid,
        username: data[0].username,
        name: data[0].name,
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
