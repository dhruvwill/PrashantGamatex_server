import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import {
  constantsquery,
  getAssociatedUsers,
  getcategoryfollowup,
  getdocumentnofollowupquery,
  getdocumentnoleadquery,
} from "../queries/constants";
import { authenticateJWT } from "../middleware/authenticateJWT";

const constRouter = Router();

constRouter.get(
  "/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const params = {
        LeadSource: "LeadSource",
        Category: "Category",
        TimeFrame: "TimeFrame",
        Currency: "Currency",
        Product: "Product",
        Application: "Application",
        Expense: "Expense",
        Form: "Lead",
      };
      const data = await (req as any).knex.raw(constantsquery, [
        params.LeadSource,
        params.TimeFrame,
        params.Currency,
        params.Category,
        params.Product,
        params.Application,
        params.Expense,
        params.Form,
        req.body.user.uid,
      ]);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

constRouter.get(
  "/get/documentno/followup",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const data = await (req as any).knex.raw(getdocumentnofollowupquery, [
        req.query.CategoryName,
        1,
      ]);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

constRouter.get(
  "/get/documentno/lead",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const data = await (req as any).knex.raw(getdocumentnoleadquery, [
        req.query.CategoryName,
        1,
      ]);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

constRouter.get(
  "/get/category/followup",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const data = await (req as any).knex.raw(getcategoryfollowup, [
        req.body.user.uid,
      ]);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

constRouter.get(
  "/lead/associatedusers",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const data = await (req as any).knex.raw(getAssociatedUsers,
        [req.body.user.uid]
      );
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
)

export default constRouter;
