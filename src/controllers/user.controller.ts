import {
   createAccountService,
   loginAccountService,
   logoutAccountService,
} from "../services/authentication.services";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { optionsOfCookie } from "../constant";
import { AuthRequest } from "../middlewares/authorize.middleware";


const singUpController = asyncHandler(async (req: Request, res: Response) => {
   const { fullName, email, password } = req.body;

   if ([fullName, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All Filed is required");
   }

   const createdUser = await createAccountService(fullName, email, password);

   if (!createdUser) {
      throw new ApiError(
         500,
         "Something went wrong while registering the user"
      );
   }

   return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User register Successfully"));
});

//login controller
const loginController = asyncHandler(async (req: Request, res: Response) => {
   const { email, password } = req.body;
   if ([email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All Filed is required");
   }
   const loginUserInstance = await loginAccountService(email, password);
   if ("accessToken" in loginUserInstance) {
      res.status(200)
         .cookie("accessToken", loginUserInstance.accessToken, optionsOfCookie)
         .cookie(
            "refreshToken",
            loginUserInstance.refreshToken,
            optionsOfCookie
         )
         .json(new ApiResponse(200, loginUserInstance, "User Are Logged-in"));
   } else {
      throw new ApiError(501, "Token Not Sended Please Check");
   }
});

const logoutController = asyncHandler(async (req: AuthRequest, res: Response) => {
   const id = req.user?.id;

   const removeToken = await logoutAccountService(id!);

   return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(
         new ApiResponse(200, removeToken, "User Account Logout SuccessFully")
      );
});

const getUserController = asyncHandler(async (req:AuthRequest,res:Response)=>{
   return res.status(200).json(
      new ApiResponse(200,req.user,"Get User SuccessFully")
   )
})

export { singUpController, loginController,logoutController,getUserController };
