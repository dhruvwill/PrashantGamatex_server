import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { sign } from "jsonwebtoken";
import { userloginquery } from "../queries/auth";
import {
  PrashantGamatex_OTHER,
  Ferber_OTHER,
  WestPoint_OTHER,
} from "../config/constants";

const authRouter = Router();
const secret: string = process.env.JWT_SECRET!;

authRouter.post("/login", setDatabaseConnection, async (req: any, res: any) => {
  try {
    const querydata = req.body;

    const data = await req.knex.raw(userloginquery, [
      querydata.user.username,
      querydata.user.password,
      querydata.user.deviceName || "Mobile",
      querydata.user.pushToken || "",
    ]);
    const company = querydata.user.company;
    if (data.length > 0) {
      let payload = {
        ...data[0],
        company: company,
        hasElevatedPermissions: false,
      };

      switch (company) {
        case "PrashantGamatex":
          if (payload.uid === PrashantGamatex_OTHER) {
            payload.hasElevatedPermissions = true;
          }
          break;
        case "Ferber":
          if (payload.uid === Ferber_OTHER) {
            payload.hasElevatedPermissions = true;
          }
          break;
        case "WestPoint":
          if (payload.uid === WestPoint_OTHER) {
            payload.hasElevatedPermissions = true;
          }
          break;
        default:
          payload.hasElevatedPermissions = false;
          break;
      }
      const token = sign(payload, secret, { expiresIn: "4h" });
      res.status(200).json({ payload, token });
    } else {
      res.status(401).json({ error: "Invalid Username or Password" });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Some Error Occurred" });
  }
});

export default authRouter;
