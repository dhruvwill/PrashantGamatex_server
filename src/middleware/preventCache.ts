import { NextFunction } from "express";

export function noCache(req: any, res: any, next: NextFunction) {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Expires: "0",
    Pragma: "no-cache",
  });
  next();
}
