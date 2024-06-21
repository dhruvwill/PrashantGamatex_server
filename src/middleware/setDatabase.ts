import { Request, Response, NextFunction } from "express";
import { getKnexInstance } from "../db";

export const setDatabaseConnection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userCompany = (req as any).user.company;
  console.log("SET DB", req);
  try {
    (req as any).knex = getKnexInstance(userCompany);
    next();
  } catch (error) {
    next(error);
  }
};
