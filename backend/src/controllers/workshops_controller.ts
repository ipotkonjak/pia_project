import * as express from 'express';
import Workshops from '../models/workshops';


export class WorkshopsController{


    getAllAdmin = (req : express.Request, res : express.Response) => {
        Workshops.find({ },(err, worksh) => {
            if(err) console.log(err);
            else res.json(worksh);
        })
    }

    getAll = (req : express.Request, res : express.Response) => {
        let name = req.body.name;
        let place = req.body.place;
        Workshops.find({ $and: [{'status' : 'active'},{$gt : {'date' : new Date(Date.now())}},{'name' :{$regex : name}},{'place': {$regex : place}}] },(err, worksh) => {
            if(err) console.log(err);
            else res.json(worksh);
        })
    }

    getById = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        Workshops.findOne({'idW' : idW},(err, worksh) => {
            if(err) console.log(err);
            else res.json(worksh);
        })
    }

    getForUserActive = (req : express.Request, res : express.Response) => {
        let email = req.body.email;
        // console.log(email);
        Workshops.find({ $and: [{'status' : 'active'}, {'date' : {$gt : new Date(Date.now())}} ,{$or : [{'participants' : email}, {'waiting' : email}]}] },(err, worksh) => {
            if(err) console.log(err);
            else {
                // console.log(worksh);
                res.json(worksh);
            }
        })
    }

    getForUserOver = (req : express.Request, res : express.Response) => {
        let email = req.body.email;
        Workshops.find({ $and: [{'status' : 'active'}, {'date' : {$lt : new Date(Date.now())}} ,{$or : [{'participants' : email}]}] },(err, worksh) => {
            if(err) console.log(err);
            else res.json(worksh);
        })
    }

    insertWorksh = (req : express.Request, res : express.Response) => {
        let name = req.body.name;
        let organizer = req.body.organizer;
        let date = new Date(req.body.date);
        let place = req.body.place;
        let shortDescr = req.body.shortDescr;
        let longDescr = req.body.longDescr;
        let mainPhoto = req.body.mainPhoto;
        let gallery = req.body.gallery;
        let availableSpots = parseInt(req.body.availableSpots);
        let participants = [];
        let waiting = [];
        let toNotify = [];
        let status = req.body.status;
        let likes = [];
        let comments = [];

        Workshops.find((err, worksh) => {
            if(err) console.log(err);
            else {
                let idW = 0;
                if(worksh.length > 0) {
                    idW = worksh[0].idW + 1;
                }

                let toInsert = new Workshops({
                    idW : idW,
                    organizer : organizer,
                    name : name,
                    date : date,
                    place : place,
                    shortDescr : shortDescr,
                    longDescr : longDescr,
                    mainPhoto : mainPhoto,
                    gallery : gallery,
                    status : status,
                    availableSpots : availableSpots,
                    participants : participants,
                    waiting : waiting,
                    toNotify : toNotify,
                    likes : likes,
                    comments : comments
                });

                toInsert.save();

                if(status == 'active')res.json({'message' : 'Radionica dodata'});
                else res.json({'message' : 'Predlog radionice poslat na razmatranje'});
            }
        }).sort({'idW' : -1}).limit(1);
    }

    addWaiting =  (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        let email = req.body.email;

        Workshops.collection.updateOne({"idW" : idW}, {$push : {"waiting" : email}, $inc : {"availableSpots" : -1}});
        res.json({'message' : 'Zahtev poslat'});
    }

    addToNotify = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        let email = req.body.email;

        Workshops.collection.updateOne({"idW" : idW}, {$push : {"toNotify" : email}});
        res.json({'message' : 'Zahtev poslat'});
    }

    acceptUser = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        let email = req.body.email;

        Workshops.collection.updateOne({"idW" : idW}, {$push : {"participants" : email}, $pull: { 'waiting': email }});
        res.json({'message' : 'Zahtev poslat'});
    }

    clearNotify = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        let email = req.body.email;

        Workshops.findOne({"idW" : idW}, (err, worksh) => {
            if(err) console.log(err);
            else {
                let users = worksh.toNotify;
                users.forEach(element => {
                    const sgMail = require('@sendgrid/mail')
                    sgMail.setApiKey('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')
                    const msg = {
                    to: element,
                    from: 'potkonjak.iva@gmail.com',
                    subject: 'Oslobodjeno mesto u radionici',
                    text: 'Obavestavamo Vas da je mesto u radionici ' + worksh.name + ' oslobodjeno, ukoliko i dalje zelite da ucestvujete prijavu mozete izvrsiti sada!',
                    html: 'Obavestavamo Vas da je mesto u radionici ' + worksh.name + ' oslobodjeno, ukoliko i dalje zelite da ucestvujete prijavu mozete izvrsiti sada!',
                    }
                    sgMail
                    .send(msg)
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.error(error)
                    })

                    
                });
                Workshops.collection.updateOne({'idW' : idW}, {$set : {"availableSpots" : worksh.availableSpots + 1, "toNotify" : []}, $pull : {"participants" : email, "waiting" : email}});
                res.json({'message' : 'Uspesna odjava iz radionice'});
            }
        })
    }

    cancelWorksh = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        Workshops.findOne({'idW' : idW}, (err, worksh) => {
            if(err) console.log(err);
            else {
                let participants : Array<String> = worksh.participants;
                let waiting : Array<String> = worksh.waiting;
                let users = participants.concat(waiting);
                users.forEach(element => {
                    const sgMail = require('@sendgrid/mail')
                    sgMail.setApiKey('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')
                    const msg = {
                    to: element,
                    from: 'potkonjak.iva@gmail.com',
                    subject: 'Otkazana radionica',
                    text: 'Obavestavamo Vas da je radionica' + worksh.name + ' otkazana!',
                    html: 'Obavestavamo Vas da je radionica ' + worksh.name + ' otkazana!',
                    }
                    sgMail
                    .send(msg)
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.error(error)
                    })

                    
                });

                Workshops.collection.updateOne({'idW' : idW}, {$set : {'status' : 'canceled'}});

                res.json({'message' : 'Uspesno otkazivanje radionice'});
            }
        })
    }

    updateWorksh = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        let name = req.body.name;
        let date = new Date(req.body.date);
        let place = req.body.place;
        let shortDescr = req.body.shortDescr;
        let longDescr = req.body.longDescr;
        let mainPhoto = req.body.mainPhoto;
        let gallery = req.body.gallery;

        Workshops.collection.updateOne({'idW' : idW}, {$set : {'name' : name, 'date' : date, 'place' : place, 'shortDescr' : shortDescr,
    'longDescr' : longDescr, 'mainPhoto' : mainPhoto, 'gallery' : gallery}});
        res.json({'message' : 'Uspesna izmena radionice'});
    }

    rejectRequest = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        Workshops.collection.updateOne({'idW' : idW}, {$set : {'status' : 'deactivated'}});
        res.json({'message' : 'Uspesno odbijena radionica'});
    }

    acceptRequst = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        Workshops.collection.updateOne({'idW' : idW}, {$set : {'status' : 'active'}});
        res.json({'message' : 'Uspesno prihvacena radionica'});
    }

    deleteWorkshop = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        Workshops.collection.deleteOne({'idW' : idW});
        res.json({'message' : 'Uspesno obrisana radionica'});
    }

    getLikesForUser = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        Workshops.find({'likes' : username}, (err, worksh) => {
            if(err) console.log(err);
            else res.json(worksh);
        })
    } 

    removeLikeForUser = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        let idW = parseInt(req.body.idW);
        Workshops.collection.updateOne({'idW' : idW}, {$pull : {'likes' : username}});

        res.json({'message' : 'Uspesno uklonjen lajk'});
    }

    getCommentsForUser = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        Workshops.find({'comments.username' : username}, (err, worksh) => {
            if(err) console.log(err);
            else {
                let comments = [];
                worksh.forEach(element => {
                    let comm = element.comments.filter(e => e.username == username);
                    comments = comments.concat(comm);
                });
                res.json(comments);
            }
        })
    } 

    removeCommentForUser = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        let date = new Date(req.body.date);
        Workshops.findOne({'comments.username' : username, 'comments.date' : date}, (err, worksh) => {
            if(err) console.log(err);
            else {
                // console.log('aaaaaaaaaaaaa');
                let comments = worksh.comments.filter(e => e.username != username || new Date(e.date).getTime() != date.getTime());
                // console.log(comments);
                Workshops.collection.updateOne({'idW' : worksh.idW}, {$set : {'comments' : comments}});
                res.json({'message' : 'Uspesno uklanjanje komentara'});
            }
        })
    }

    editCommentForUser = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        let date = new Date(req.body.date);
        let text = req.body.text;

        Workshops.findOne({'comments.username' : username, 'comments.date' : date}, (err, worksh) => {
            if(err) console.log(err);
            else {
                let comments = worksh.comments;
                comments.forEach(element => {
                    if(element.username == username && new Date(element.date).getTime() == date.getTime()) element.text = text;
                });
                Workshops.collection.updateOne({'idW' : worksh.idW}, {$set : {'comments' : comments}});
                res.json({'message' : 'Uspesna izmena komentara'});
            }
        })        
    }

    getAllLikes = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        Workshops.findOne({'idW' : idW}, (err, worksh) => {
            if(err) console.log(err);
            else {
                res.json(worksh.likes);
            }
        })
    }

    getAllComments = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        Workshops.findOne({'idW' : idW}, (err, worksh) => {
            if(err) console.log(err);
            else {
                res.json(worksh.comments);
            }
        })
    }

    addLike = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        let username = req.body.username;

        Workshops.collection.updateOne({'idW' : idW}, {$push : {'likes' : username}});
        res.json({'message' : 'Uspesno dodavanje komentara'});
    }

    addComment = (req : express.Request, res : express.Response) => {
        let idW = parseInt(req.body.idW);
        let comment = req.body.comment;
        comment.date = new Date(comment.date);

        Workshops.collection.updateOne({'idW' : idW}, {$push : {'comments' : comment}});
        res.json({'message' : 'Uspesno dodavanje komentara'});
    }

    checkNameParticipant = (req : express.Request, res : express.Response) => {
        let email = req.body.email;
        let name = req.body.name;
        Workshops.find({ $and: [{'status' : 'active'}, {$le : {'date' : new Date(Date.now())}} ,{$or : [{'participants' : email}]}, {'name' : name}] },(err, worksh) => {
            if(err) console.log(err);
            else res.json(worksh);
        })
    }

    getForOrganizer = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        Workshops.find({ $and: [{'organizer' : username},{$or : [{'status' : 'active'}, {'status' : 'canceled'}]}] }, (err, worksh) => {
            if(err) console.log(err);
            else res.json(worksh);
        })
    }

}