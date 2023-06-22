import * as express from 'express';
import Users from '../models/Users';
import { randomInt } from 'crypto';
import Workshops from '../models/workshops';
import Chats from '../models/chats';


export class UsersController{

    getAll = (req:express.Request,res:express.Response)=>{
        Users.find({}, (err, users) => {
            if(err) console.log(err);
            else res.json(users);
        })
    } 

    login = (req:express.Request,res:express.Response)=>{
        let username = req.body.username;
        let password = req.body.password;

        Users.findOne({'username' : username},(err,user)=>{
            if(err)console.log(err)
            else{
                if(user == null) {
                    res.json({'message' : 'Pogresno korisnicko ime'});
                    return;
                }
                if(user.type == "admin") {
                    res.json({'message' : 'Ulogovati se kao admin preko specijalne forme'});
                    return;
                }
                if(user.status == "waiting") {
                    res.json({'message' : 'Vas zahtev jos nije obradjen od stane administratora'});
                    return;
                }
                if(user.status == "deactivated") {
                    res.json({'message' : 'Vas nalog je ugasen'});
                    return;
                }
                if(user.passwordForgotten &&  Date.now()-user.time  <30*60*1000){
                    if(password==user.password)res.json(user);
                    else res.json({'message' : 'Pogresna lozinka'});
                    return;
                }
                else if(user.passwordForgotten &&  Date.now()-user.time >= 30*60*1000) {
                    res.json({'message' : 'Nije promenjena lozinka na vreme, resetovati sifru ponovo'})
                }else{
                    if(password==user.password) res.json(user);
                    else res.json({'message' : 'Pogresna lozinka'});
                }
            }
        })
    }

    loginAdmin =(req:express.Request,res:express.Response)=>{
        let username = req.body.username;
        let password = req.body.password;

        Users.findOne({'username' : username},(err,user)=>{
            if(err)console.log(err)
            else{
                if(user == null) {
                    res.json({'message' : 'Pogresno korisnicko ime'});
                    return;
                }
                if(user.type != "admin") {
                    res.json({'message' : 'Ulogovati se preko standardne forme'});
                    return;
                }
                if(user.passwordForgotten &&  Date.now()-user.time  <30*60*1000){
                    if(password==user.password)res.json(user);
                    else res.json({'message' : 'Pogresna lozinka'});
                    return;
                }
                else if(user.passwordForgotten &&  Date.now()-user.time >= 30*60*1000) {
                    res.json({'message' : 'Nije promenjena lozinka na vreme, resetovati sifru ponovo'})
                }else{
                    if(password==user.password) res.json(user);
                    else res.json({'message' : 'Pogresna lozinka'});
                }
            }
        })
    }

    checkData = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        let email = req.body.email;
        // console.log(username + " " + email);
        Users.find({$or : [{"username" : username}, {"email" : email}]}, (err, user) => {
            if(err) {
                console.log(err)
            }
            else {
                if(user.length > 0) {
                    res.json(user[0]);
                    // console.log(user.username + " " + user.email);
                }
                else res.json(null);
            }
        })
    }

    checkEmail = (req : express.Request, res : express.Response) => {
        let email = req.body.email;
        Users.find( {"email" : email}, (err, user) => {
            if(err) {
                console.log(err)
            }
            else {
                if(user.length > 0) {
                    res.json(user[0]);
                }
                else res.json(null);
            }
        })
    }

    register = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let tel = req.body.tel;
        let photo = req.body.photo;
        let type = req.body.type;
        let status = req.body.status;
        let passwordForgotten = false;
        let timeSent = null;

        let user;
        if(type == "organizer") {
            let orgName = req.body.orgName;
            let orgAddress = req.body.orgAddress;
            let orgNumber = req.body.orgNumber;
            user = new Users({
                username : username,
                password : password,
                firstname : firstname,
                lastname : lastname,
                email : email,
                tel : tel,
                photo : photo,
                type : type,
                status : status,
                passwordForgotten : passwordForgotten,
                timeSent : timeSent,
                orgName : orgName,
                orgAddress : orgAddress,
                orgNumber : orgNumber
            });
        }
        else {
            user = new Users({
                username : username,
                password : password,
                firstname : firstname,
                lastname : lastname,
                email : email,
                tel : tel,
                photo : photo,
                type : type,
                status : status,
                passwordForgotten : passwordForgotten,
                timeSent : timeSent
            });
        }

        user.save();
        if(user.status == "waiting")res.json({'message' : "Poslat zahtev za registracijom"});
        else res.json({'message' : "Unet korisnik"});
    }

    changePassword = (req : express.Request, res : express.Response) => {
        let email = req.body.email;
        let password = "";
        for(let i=0;i<5;i++){
            let lowercase = randomInt(26);
            password += String.fromCharCode('a'.charCodeAt(0) + lowercase);
        }
        
        let number = randomInt(10);
        password += number;
    
        let uppercase = randomInt(26);
        password += String.fromCharCode('A'.charCodeAt(0) + uppercase);

        let special = ['@', '\\', '!', ',', '.', '/'];
        password += special[randomInt(6)];

        Users.findOne({'email' : email}, (err, user) => {
            if(err) console.log(err);
            else {
                Users.collection.updateOne({'email' : email}, {$set : {'password' : password , 'passwordForgotten': true, 'timeSent': Date.now()}});
                const sgMail = require('@sendgrid/mail')
                sgMail.setApiKey('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')
                const msg = {
                to: email,
                from: 'potkonjak.iva@gmail.com',
                subject: 'Zaboravljena lozinka',
                text: 'Kako biste povratili pristup svom nalogu za vas je generisana privremena lozinka (videti u nastavku) i neophodno je da je promenite u narednih 30 minuta.',
                html: 'Kako biste povratili pristup svom nalogu za vas je generisana privremena lozinka (videti u nastavku) i neophodno je da je promenite u narednih 30 minuta' +
                '<br> <strong>' + password +'</strong>',
                }
                sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })

                res.json({'message' : "Poslat je mejl za promenu lozinke"});
            }
        })
    }

    setPassword = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        Users.collection.updateOne({'username' : username}, {$set : {'password' : password , 'passwordForgotten': false, 'timeSent': null}});
                
        res.json({'message' : 'Promenjena lozinka'});
    }

    updateProfile = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        let emailOld = req.body.emailOld;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let tel = req.body.tel;
        let photo = req.body.photo;
        let orgName = req.body.orgName;
        let orgAddress = req.body.orgAddress;
        let orgNumber = req.body.orgNumber;
        let type = req.body.type;
        if(type == 'participant') {
            Users.collection.updateOne({'username' : username}, {$set : {'firstname' : firstname , 'lastname': lastname, 'email': email, 'tel' : tel, 'photo' : photo}});
        }
        else if(type == 'organizer') {
            Users.collection.updateOne({'username' : username}, {$set : {'firstname' : firstname , 'lastname': lastname, 'email': email, 'tel' : tel, 'photo' : photo,
        'orgName' : orgName, 'orgAddress' : orgAddress, 'orgNumber' : orgNumber}});
        }
        if(emailOld != email) {
            Workshops.find({'participants' : emailOld}, (err, worksh) => {
                if(err) console.log(err);
                else {
                    worksh.forEach(element => {
                        let participants : Array<String> = element.participants.filter(e => e != emailOld);
                        participants.push(email);
                        Workshops.collection.updateOne({'idW' : element.idW}, {$set : {'participants' : participants}});
                    });
                }
            })
            Workshops.find({'waiting' : emailOld}, (err, worksh) => {
                if(err) console.log(err);
                else {
                    worksh.forEach(element => {
                        let waiting : Array<String> = element.waiting.filter(e => e != emailOld);
                        waiting.push(email);
                        Workshops.collection.updateOne({'idW' : element.idW}, {$set : {'waiting': waiting}});
                    });
                }
            })
            Workshops.find({'toNotify' : emailOld}, (err, worksh) => {
                if(err) console.log(err);
                else {
                    worksh.forEach(element => {
                        let toNotify : Array<String> = element.toNotify.filter(e => e != emailOld);
                        toNotify.push(email);
                        Workshops.collection.updateOne({'idW' : element.idW}, {$set : {'toNotify': toNotify}});
                    });
                }
            })
        }
                
        res.json({'message' : 'Uspesno azuriranje profila'});
    }

    rejectRequest = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        Users.collection.updateOne({'username' : username}, {$set : {'status' : 'deactivated'}});
        res.json({'message' : 'Uspesno deaktiviran nalog'});
    }

    acceptRequst = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        Users.collection.updateOne({'username' : username}, {$set : {'status' : 'active'}});
        res.json({'message' : 'Uspesno aktiviran nalog'});
    }

    deleteAccount = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        Users.collection.deleteOne({'username' : username});
        Workshops.collection.deleteMany({'organizer' : username});
        Chats.collection.deleteMany({$or : [{'participant' : username}, {'organizer' : username}]});
        Workshops.find({'likes' : username}, (err, worksh) => {
            if(err) console.log(err);
            else {
                worksh.forEach(element => {
                    Workshops.collection.updateOne({'idW' : element.idW}, {$pull : {'likes' : username}});
                });
            }
        })
        Workshops.find({'comments.username' : username}, (err, worksh) => {
            if(err) console.log(err);
            else {
                worksh.forEach(element => {
                    let comments = element.comments.filter(e => e.username != username);
                    Workshops.collection.updateOne({'idW' : element.idW}, {$set : {'comments' : comments}});
                });
            }
        })
        res.json({'message' : 'Uspesno obrisan nalog'});
    }

    getByUsername = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        Users.findOne({'username': username}, (err, user) => {
            if(err) console.log(err);
            else {
                res.json(user);
            }
        })
    }

    upgradeUser = (req : express.Request, res : express.Response) => {
        let username = req.body.username;
        Users.collection.updateOne({'username' : username}, {$set : {'type' : 'organizer'}});
        res.json({'message' : "Uspesno promenjen tip korisnika"});
    }
}

