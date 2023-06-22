import { Router } from "express";
import { UsersController } from "../controllers/users_controller";


const usersRouter= Router();

usersRouter.route("/getAll").get(
    (req,res)=>new UsersController().getAll(req,res)
)
usersRouter.route("/checkData").post(
    (req,res)=>new UsersController().checkData(req,res)
)
usersRouter.route("/checkEmail").post(
    (req,res)=>new UsersController().checkEmail(req,res)
)
usersRouter.route("/register").post(
    (req,res)=>new UsersController().register(req,res)
)
usersRouter.route("/changePassword").post(
    (req,res)=>new UsersController().changePassword(req,res)
)
usersRouter.route("/login").post(
    (req,res)=>new UsersController().login(req,res)
)
usersRouter.route("/loginAdmin").post(
    (req,res)=>new UsersController().loginAdmin(req,res)
)
usersRouter.route("/setPassword").post(
    (req,res)=>new UsersController().setPassword(req,res)
)
usersRouter.route("/updateProfile").post(
    (req,res)=>new UsersController().updateProfile(req,res)
)
usersRouter.route("/rejectRequest").post(
    (req,res)=>new UsersController().rejectRequest(req,res)
)
usersRouter.route("/acceptRequst").post(
    (req,res)=>new UsersController().acceptRequst(req,res)
)
usersRouter.route("/deleteAccount").post(
    (req,res)=>new UsersController().deleteAccount(req,res)
)
usersRouter.route("/getByUsername").post(
    (req,res)=>new UsersController().getByUsername(req,res)
)
usersRouter.route("/upgradeUser").post(
    (req,res)=>new UsersController().upgradeUser(req,res)
)

export default usersRouter;