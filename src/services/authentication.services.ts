import { ApiError } from "../utils/ApiError";
import prisma from "../db/connectionDB";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

//password check condition
export async function isPasswordCheck(
   inputPassword: string,
   DBPassword: string
) {
   return await bcrypt.compare(inputPassword, DBPassword);
}

//generate access and refreshToken
function generateAccessAndRefreshToken(email: string, id: string) {
   const accessToken = JWT.sign(
      {
         id: id,
         email: email,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
   );
   const refreshToken = JWT.sign(
      {
         id: id,
         email: email,
      },
      process.env.REFRESH_TOKEN_SECRET!,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
   );

   return { accessToken, refreshToken };
}

//create account service
export async function createAccountService(
   fullName: string,
   email: string,
   password: string
) {
   try {
      const existedUser = await prisma.user.findFirst({
         where: {
            email: email,
         },
      });
      console.log(existedUser);

      if (existedUser)
         throw new ApiError(401, "This EmailID Already Store in Database");

      const hashedPassword = await bcrypt.hash(password, 10);
      const createdNewAccount = await prisma.user.create({
         data: {
            fullName: fullName,
            email: email,
            password: hashedPassword,
         },
      });

      if (!createdNewAccount)
         new ApiError(500, "New Account Not Create Let Check");

      return createdNewAccount;
   } catch (error: any) {
      console.log("Error: ", error);
      return new ApiError(
         501,
         "Something Have Error in Authentication Block",
         error
      );
   }
}

//login service
export async function loginAccountService(email: string, password: string) {
   try {
      const existedUser = await prisma.user.findFirst({
         where: {
            email: email,
         },
      });

      if (!existedUser) throw new ApiError(400, "Email Not Existed In DB");
      const isPasswordCorrect = await isPasswordCheck(
         password,
         existedUser.password
      );
      if (!isPasswordCorrect)
         throw new ApiError(400, "Password Is Not Correct Please Check");

      const { accessToken, refreshToken } = generateAccessAndRefreshToken(
         existedUser.email,
         existedUser.id
      );

      existedUser.refreshToken = refreshToken;

      await prisma.user.update({
         where: { email: email },
         data: { refreshToken: existedUser.refreshToken },
      });

      return { accessToken, refreshToken };
   } catch (error: any) {
      console.log("Error: ", error);
      return new ApiError(501, "Something Have Error in Login Account", error);
   }
}

//logout service
export async function logoutAccountService(id: string) {
   try {
      const removeToken = await prisma.user.update({
         where: {
            id: id,
         },
         data: {
            refreshToken: null,
         },
      });

      console.log("remove user", removeToken);
      return removeToken;
   } catch (error: any) {
      console.log("Error: ", error);
      return new ApiError(501, "Something Have Error in Logout ", error);
   }
}
