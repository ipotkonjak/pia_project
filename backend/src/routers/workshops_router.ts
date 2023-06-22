import { Router } from "express";
import { WorkshopsController } from "../controllers/workshops_controller";


const workshopsRouter= Router();

workshopsRouter.route("/getAllAdmin").get(
    (req,res)=>new WorkshopsController().getAllAdmin(req,res)
)
workshopsRouter.route("/getAll").post(
    (req,res)=>new WorkshopsController().getAll(req,res)
)
workshopsRouter.route("/getById").post(
    (req,res)=>new WorkshopsController().getById(req,res)
)
workshopsRouter.route("/getForUserActive").post(
    (req,res)=>new WorkshopsController().getForUserActive(req,res)
)
workshopsRouter.route("/getForUserOver").post(
    (req,res)=>new WorkshopsController().getForUserOver(req,res)
)
workshopsRouter.route("/insertWorksh").post(
    (req,res)=>new WorkshopsController().insertWorksh(req,res)
)
workshopsRouter.route("/addWaiting").post(
    (req,res)=>new WorkshopsController().addWaiting(req,res)
)
workshopsRouter.route("/addToNotify").post(
    (req,res)=>new WorkshopsController().addToNotify(req,res)
)
workshopsRouter.route("/acceptUser").post(
    (req,res)=>new WorkshopsController().acceptUser(req,res)
)
workshopsRouter.route("/clearNotify").post(
    (req,res)=>new WorkshopsController().clearNotify(req,res)
)
workshopsRouter.route("/cancelWorksh").post(
    (req,res)=>new WorkshopsController().cancelWorksh(req,res)
)
workshopsRouter.route("/updateWorksh").post(
    (req,res)=>new WorkshopsController().updateWorksh(req,res)
)
workshopsRouter.route("/rejectRequest").post(
    (req,res)=>new WorkshopsController().rejectRequest(req,res)
)
workshopsRouter.route("/acceptRequst").post(
    (req,res)=>new WorkshopsController().acceptRequst(req,res)
)
workshopsRouter.route("/deleteWorkshop").post(
    (req,res)=>new WorkshopsController().deleteWorkshop(req,res)
)
workshopsRouter.route("/getLikesForUser").post(
    (req,res)=>new WorkshopsController().getLikesForUser(req,res)
)
workshopsRouter.route("/removeLikeForUser").post(
    (req,res)=>new WorkshopsController().removeLikeForUser(req,res)
)
workshopsRouter.route("/getCommentsForUser").post(
    (req,res)=>new WorkshopsController().getCommentsForUser(req,res)
)
workshopsRouter.route("/removeCommentForUser").post(
    (req,res)=>new WorkshopsController().removeCommentForUser(req,res)
)
workshopsRouter.route("/editCommentForUser").post(
    (req,res)=>new WorkshopsController().editCommentForUser(req,res)
)
workshopsRouter.route("/getAllLikes").post(
    (req,res)=>new WorkshopsController().getAllLikes(req,res)
)
workshopsRouter.route("/getAllComments").post(
    (req,res)=>new WorkshopsController().getAllComments(req,res)
)
workshopsRouter.route("/addLike").post(
    (req,res)=>new WorkshopsController().addLike(req,res)
)
workshopsRouter.route("/addComment").post(
    (req,res)=>new WorkshopsController().addComment(req,res)
)
workshopsRouter.route("/checkNameParticipant").post(
    (req,res)=>new WorkshopsController().checkNameParticipant(req,res)
)
workshopsRouter.route("/getForOrganizer").post(
    (req,res)=>new WorkshopsController().getForOrganizer(req,res)
)


export default workshopsRouter;