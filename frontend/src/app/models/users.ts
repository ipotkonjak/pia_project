import Address from "./address";

export default class Users{
    username : string;
    password : string;
    firstname : string;
    lastname : string;
    email : string;
    tel : string;
    photo : string;
    type : string;
    status : string;
    passwordForgotten : Date;
    timeSend : string;
    orgName : string;
    orgAddress : Address;
    orgNumber : string;
};