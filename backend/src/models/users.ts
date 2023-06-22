import mongoose from "mongoose";


const Schema=mongoose.Schema;

const Users = new Schema({
    "username" : {
        type : String
    },
    "password" : {
        type : String
    },
    "firstname" : {
        type : String
    },
    "lastname" : { 
        type : String
    },
    "email" : {
        type : String
    },
    "tel" : {
        type : String
    },
    "photo" : {
        type : String
    },
    "type" : {
        type : String
    },
    "status" : {
        type : String
    },
    "passwordForgotten" : {
        type : Boolean
    },
    "timeSent" : {
        type : Date
    },
    "orgName" : {
        type : String
    },
    "orgAddress" : {
        type : JSON
    },
    "orgNumber" : {
        type : String
    }
})


export default mongoose.model("Users",Users,"users");