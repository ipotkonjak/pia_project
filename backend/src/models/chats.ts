import mongoose from "mongoose";


const Schema=mongoose.Schema;

const Chats = new Schema({
    "workshop" : {
        type : Number
    },
    "chatPhoto" : {
        type : String
    },
    "organizer" : {
        type : String
    },
    "organizerPhoto" : {
        type : String
    },
    "participant" : {
        type : String
    },
    "participantPhoto" : {
        type : String
    },
    "messages" : {
        type : Array
    }
})


export default mongoose.model("Chats",Chats,"chats");