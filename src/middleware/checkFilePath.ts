import express from "express";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { FOLLOWUP_IMAGE_BASE_PATH, IMAGE_BASE_PATH } from "../config/constants";

// Middleware to check if the requested file is within the allowed directory
const checkFilePath = (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  const filename = req.params.filename;
  const filePath = path.join(FOLLOWUP_IMAGE_BASE_PATH, filename);

  // Ensure the file path is within the allowed directory
  if (!filePath.startsWith(FOLLOWUP_IMAGE_BASE_PATH) && !filePath.startsWith(IMAGE_BASE_PATH)) {
    return res.status(403).send("Access denied");
  }

  next();
};

export default checkFilePath;
