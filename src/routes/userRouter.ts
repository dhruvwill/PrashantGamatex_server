import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { authenticateJWT } from "../middleware/authenticateJWT";

const userRouter = Router();

userRouter.post(
  "/lead/insert",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    // const user = (req as any).user;

    // // Now you can use the authenticated user's data
    // console.log(user);

    // // Example query
    // try {
    //   const result = await (req as any).knex("dbo.SomeTable").insert({
    //     userId: user.uid,
    //     company: user.company,
    //     // other data from req.body
    //   });
    //   res.status(200).json({ success: true, result });
    // } catch (error) {
    //   res.status(500).json({ error: "Some Error Occurred" });
    // }
    res.status(200).json({ success: true });
  }
);

export default userRouter;
