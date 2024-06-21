import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

const secret: string = process.env.JWT_SECRET!;

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    verify(token, secret, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }

      // Attach user to request object
      (req as any).body.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export { authenticateJWT };
