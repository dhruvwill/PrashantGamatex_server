import { Request, Response, NextFunction } from "express";
import { getKnexInstance } from "../db";

export const setDatabaseConnection = (
  req: any,
  res: any,
  next: NextFunction
) => {
  const userCompany = req.body.company;
  try {
    req.knex = getKnexInstance(userCompany);
    next();
  } catch (error) {
    next(error);
  }
};
