import multer from "multer";
import { NextFunction, Request, Response } from "express";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadFiles = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.any()(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send("File Upload Error");
      } else {
        return res.status(500).send("Server Error");
      }
    }
    next();
  });
};
