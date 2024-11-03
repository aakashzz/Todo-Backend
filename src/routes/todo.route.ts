import { Router } from "express";
import verifyUserToken from "../middlewares/authorize.middleware";
import { createTodoController, getAllSubTodoController, newTodoController } from "../controllers/todo.controller";

const router = Router();

router.route("/create").post(verifyUserToken,createTodoController)
router.route("/new-todo").post(verifyUserToken,newTodoController)
router.route("/get-todo/:todoId").get(verifyUserToken,getAllSubTodoController)

export default router