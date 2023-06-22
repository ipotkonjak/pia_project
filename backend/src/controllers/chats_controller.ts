import * as express from 'express';
import Workshops from '../models/workshops';
import Chats from '../models/chats';
import Users from '../models/Users';


export class ChatsController{

    getAllOrganizer = (req:express.Request,res:express.Response)=>{
        let workshop = parseInt(req.body.workshop);
        Chats.find({'workshop' : workshop}, (err, chats) => {
            if(err) console.log(err);
            else res.json(chats);
        })
    }

    getAllParticipant = (req:express.Request,res:express.Response)=>{
        let participant = req.body.participant;
        Chats.find({'participant' : participant}, (err, chats) => {
            if(err) console.log(err);
            else res.json(chats);
        })
    }

    getOneChat = (req:express.Request,res:express.Response)=>{
        let participant = req.body.participant;
        let workshop = parseInt(req.body.workshop);
        Chats.findOne({'participant' : participant, 'workshop' : workshop}, (err, chat) => {
            if(err) console.log(err);
            else res.json(chat);
        })
    }

    startChat = (req:express.Request,res:express.Response)=>{
        let participant = req.body.participant;
        let participantPhoto = req.body.participantPhoto;
        let workshop = parseInt(req.body.workshop);
        let message = req.body.message;
        message.date = new Date(message.date);
        let chatPhoto = req.body.chatPhoto;
        Workshops.findOne({'idW' : workshop}, (err, worksh) => {
            if(err) console.log(err);
            else {
                let organizer = worksh.organizer;
                Users.findOne({'username' : organizer}, (err, user) => {
                    
                    let messages = [];
                    messages.push(message);
                    let chat = new Chats({
                        workshop : workshop,
                        chatPhoto : chatPhoto,
                        organizer : organizer,
                        organizerPhoto : user.photo,
                        participant : participant,
                        participantPhoto : participantPhoto,
                        messages : messages
                    })
    
                    chat.save();
    
                    res.json({'message' : 'Uspesno poslata poruka'});
                })
                
            }
        })
    }

    sendMessage = (req:express.Request,res:express.Response)=>{
        let participant = req.body.participant;
        let workshop = parseInt(req.body.workshop);
        let message = req.body.message;
        message.date = new Date(message.date);

        Chats.collection.updateOne({'participant' : participant, 'workshop' : workshop}, {$push : {'messages' : message}});

        res.json({'message' : 'Uspesno poslata poruka'});
    }
}