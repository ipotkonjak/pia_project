import { Router } from "express";
import { ChatsController } from "../controllers/chats_controller";


const chatsRouter= Router();

chatsRouter.route("/getAllOrganizer").post(
    (req,res)=>new ChatsController().getAllOrganizer(req,res)
)
chatsRouter.route("/getAllParticipant").post(
    (req,res)=>new ChatsController().getAllParticipant(req,res)
)
chatsRouter.route("/getOneChat").post(
    (req,res)=>new ChatsController().getOneChat(req,res)
)
chatsRouter.route("/startChat").post(
    (req,res)=>new ChatsController().startChat(req,res)
)
chatsRouter.route("/sendMessage").post(
    (req,res)=>new ChatsController().sendMessage(req,res)
)

export default chatsRouter;