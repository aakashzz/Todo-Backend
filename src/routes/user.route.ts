import { Router } from "express";
import { getUserController, loginController, logoutController, singUpController } from "../controllers/user.controller";
import  verifyUserToken  from "../middlewares/authorize.middleware";

const router = Router();


router.route("/signup").post(singUpController)
router.route("/login").post(loginController);
router.route("/logout").get(verifyUserToken,logoutController)
router.route("/getUser").get(verifyUserToken,getUserController)


export default router