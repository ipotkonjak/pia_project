import mongoose from "mongoose";


const Schema=mongoose.Schema;

const Workshops = new Schema({
    "idW" : {
        type : Number
    },
    "organizer" : {
        type : String
    },
    "name" : {
        type : String
    },
    "date" : { 
        type : Date
    },
    "place" : {
        type : String
    },
    "shortDescr" : {
        type : String
    },
    "longDescr" : {
        type : String
    },
    "mainPhoto" : {
        type : String
    },
    "gallery" : {
        type : Array
    },
    "status" : {
        type : String
    },
    "availableSpots" : {
        type : Number
    },
    "participants" : {
        type : Array
    },
    "waiting" : {
        type : Array
    },
    "toNotify" : {
        type : Array
    },
    "likes" : {
        type : Array
    },
    "comments" : {
        type : Array
    }
})


export default mongoose.model("Workshops",Workshops,"workshops");