import { Request, Response, NextFunction } from "express";

let adminSwitchEnabled = false;

export const getAdminSwitchState = (): boolean => {
  return adminSwitchEnabled;
};

export const toggleAdminSwitch = (): boolean => {
  adminSwitchEnabled = !adminSwitchEnabled;
  return adminSwitchEnabled;
};

export const setAdminSwitchState = (state: boolean): void => {
  adminSwitchEnabled = state;
};

export const adminSwitchMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  if (!adminSwitchEnabled) {
    return next();
  }
  
  if (req.path.startsWith("/admin")) {
    return next();
  }

  res.status(503).json({
    error: "Service Unavailable",
    message: "Server is in maintenance mode.",
    adminMode: true,
  });
};

