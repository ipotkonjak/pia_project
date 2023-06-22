import Comments from "./comments";

export default class Workshops{
    idW : number;
    organizer : string;
    name : string;
    date : Date;
    place : string;
    shortDescr : string;
    longDescr : string;
    mainPhoto : string;
    gallery : Array<String>;
    status : string;
    availableSpots : number;
    participants : Array<String>;
    waiting : Array<String>;
    toNotify : Array<String>;
    likes : Array<String>;
    comments : Array<Comments>;

    allow : boolean;
};