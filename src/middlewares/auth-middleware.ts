import { Request, Response, NextFunction } from "express";
import { database } from "../context";
import { Account, Role } from "@prisma/client";
import { decodeToken } from "src/utils/token-helper";
import { authStrategies } from "src/utils/auth-strategies";

type AuthRequest = Request & { user: Account };

export type AuthRequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => void;

export default (roles: Role[]) => {
  const handler: AuthRequestHandler = async (req, res, next) => {
    let token = req.headers.authorization;

    try {
      const decoded = decodeToken(token, "access");

      if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
        return res.status(401).json({
          error: "invalid-token",
          message: "Your are not authorized to access this endpoint!!",
          action: "logout",
        });
      }

      const user = await database.account.findUnique({ where: { id: decoded.id } });

      if (!user || user.suspended) {
        return res.status(401).json({
          error: "invalid-token",
          message: "Your account has been suspended. Please contact support team!!",
          action: "logout",
        });
      }

      for (let role of roles) {
        if (!authStrategies[role](user)) {
          return res.status(401).json({ message: "Your are not authorized to access this endpoint!!" });
        }
      }

      req.user = user; // Attach the user to the request object
      next(); // Call the next middleware function in the stack
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "token-expired", message: error.message, action: "refresh-token" });
      }
      return res.status(401).json({ error: "invalid-token", message: error.message, action: "logout" });
    }
  };
  return handler;
};
