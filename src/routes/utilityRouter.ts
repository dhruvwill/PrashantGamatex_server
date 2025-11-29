import { Router, Request, Response } from "express";
import { toggleAdminSwitch, getAdminSwitchState } from "../middleware/adminSwitch";

const utilityRouter = Router();

const UTILITY_PASSWORD = process.env.UTILITY_PASSWORD || "Pr@sh@ntG@m@tex";

utilityRouter.post("/utils", (req: Request, res: Response) => {
  try {
    // Get password from headers
    const providedPassword = req.headers["x-utils-password"] as string;
    
    // Validate password
    if (!providedPassword || providedPassword !== UTILITY_PASSWORD) {
      return res.status(401).json({
        error: "Unauthorized: Invalid password",
      });
    }

    // Toggle the admin switch
    const newState = toggleAdminSwitch();
    const stateMessage = newState ? "ON" : "OFF";

    res.status(200).json({ 
      success: true,
      adminSwitch: stateMessage,
      message: `Admin Switch turned ${stateMessage}. ${newState ? "All requests are now intercepted." : "Server is now operating normally."}` 
    });
  } catch (err: any) {
    console.error("Error executing Admin Utils:", err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message 
    });
  }
});

utilityRouter.get("/utils/status", (req: Request, res: Response) => {
  const state = getAdminSwitchState();
  res.status(200).json({
    adminSwitch: state ? "ON" : "OFF",
    enabled: state,
  });
});

export default utilityRouter;

