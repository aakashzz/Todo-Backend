import JWT from "jsonwebtoken";
import prisma from "../db/connectionDB";
import { Response, NextFunction, Request } from "express";
import { ApiError } from "../utils/ApiError";
import { User } from "@prisma/client";

export interface AuthRequest extends Request {
   user?: User;
}

async function verifyUserToken(
   req: AuthRequest,
   res: Response,
   next: NextFunction
): Promise<any> {
   const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
   if (!token) {
      return next(new ApiError(400, "Token Is Not Exist Please Check Now"));
   }

   try {
      const decodedValue = JWT.verify(
         token,
         process.env.ACCESS_TOKEN_SECRET!
      ) as User;

      if (!decodedValue) {
         return next(
            new ApiError(401, "Token is expired or invalid. Please check.")
         );
      }

      const email = decodedValue.email;
      const userInfo = await prisma.user.findFirst({
         where: {
            email: email,
         },
      });

      if (!userInfo) {
         return next(new ApiError(401, "User not found in Database"));
      }

      req.user = userInfo;

      next();
   } catch (error: any) {
      console.error("Decoded Token Error ", error);
      return next(
         new ApiError(401, "Token is expired or invalid Please check ")
      );
   }
}

export default verifyUserToken;
