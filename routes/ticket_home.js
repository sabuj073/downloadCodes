import cors from 'cors';
import express from 'express';
import db from '../database.js';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const ticket_home_router = express.Router();
const saltRounds = 10;
ticket_home_router.use(cors());
ticket_home_router.use(express.json());
ticket_home_router.use(bodyParser.urlencoded({ extended: true }));
ticket_home_router.use(bodyParser.json());

const DIR = './public/images/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

ticket_home_router.all('/sliders',(req,res)=>{
    db.query("SELECT * FROM `slider` where status='1'", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/getinfo',(req,res)=>{
    db.query("SELECT * FROM `info`", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/metatag',(req,res)=>{
    const page_name = req.body.name;
    db.query("SELECT * FROM `meta_tag` where page_name=?", [page_name], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/how-to-host',(req,res)=>{
    db.query("SELECT * FROM `how_to_host_show`", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/how-to-buy-ticket',(req,res)=>{
    db.query("SELECT * FROM `how_to_buy_ticket`", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/blogs-limited',(req,res)=>{
    db.query("SELECT *,DATE_FORMAT(date,'%d %M %Y') date from blog ORDER BY date DESC limit 12", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/blogs',(req,res)=>{
    db.query("SELECT *,DATE_FORMAT(date,'%d %M %Y') date from blog ORDER BY date DESC", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/blog-details',(req,res)=>{
    const slug = req.body.slug;
    db.query("SELECT *,DATE_FORMAT(date,'%d %M %Y') date FROM `blog` WHERE blog_slug=?", [slug], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/upcoming-events',(req,res)=>{
    db.query("SELECT * FROM `events`,artist WHERE events.status = 1 and artist.artist_id = events.artist_id and event_starts_date >= CURDATE()", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/event-details',(req,res)=>{
    const slug = req.body.slug;
    db.query("SELECT * FROM `events`,artist WHERE events.status = 1 and artist.artist_id = events.artist_id and events.event_slug=?", [slug], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


ticket_home_router.all('/all-events',(req,res)=>{
    db.query("SELECT * FROM `events`,artist WHERE events.status = 1 and artist.artist_id = events.artist_id ORDER BY `events`.`event_starts_date` DESC", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/all-artists',(req,res)=>{
    db.query("SELECT * FROM `artist` where status = 1", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/top-10-artists',(req,res)=>{
    db.query("SELECT * FROM `artist` where status = 1 ORDER BY heart DESC limit 10", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/artist-you-may-like',(req,res)=>{
    db.query("SELECT * FROM `artist` where status = 1 ORDER BY RAND() DESC limit 4", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/artists-details',(req,res)=>{
    const slug = req.body.slug;
    db.query("SELECT * FROM `artist` where artist_slug=?",[slug], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/like-artist',(req,res)=>{
    const slug = req.body.slug;
    db.query("UPDATE artist SET heart = heart+1 where artist_slug=?",[slug], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    });
});

ticket_home_router.all('/create-event-app',(req,res)=>{
    const event_name = req.body.event_name;
    const event_time = req.body.event_time;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const genres = req.body.genres;
    const event_link = req.body.event_link;
    const email = req.body.email;
    const hear_about = req.body.hear_about;
    const platform = req.body.platform;
    const contactNumber = req.body.contact_number;
    const description = req.body.description;
    const venue_address = req.body.venue_address;
    const artist_budget = req.body.artist_budget;
    const type =  req.body.type;
    

    db.query(
            "INSERT INTO `event_request` (`event_name`, `start_date`, `end_date`, `genres`, `event_link`,email_address, `hear_about`,contact_number,platform, `description`,type,event_time,venue_address,artist_budget) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
            [event_name,start_date,end_date,genres,event_link,email,hear_about,contactNumber,platform,description,type,event_time,venue_address,artist_budget],(err, result) => {
            if (err) {
                res.send(200, { message: '2',status:"Something went wrong" });
            } else {
                res.send(200, { message: '1',status:"You content has been submitted successfully" });
            }
        });
    });


    ticket_home_router.all('/submit-your-content',(req,res)=>{
    const title = req.body.title;
    const format = req.body.format;
    const genre = req.body.genre;
    const trailer_link = req.body.trailer_link;
    const director_name = req.body.director_name;
    const lead_actors = req.body.lead_actors;
    const production_house = req.body.production_house;
    const email = req.body.email;
    const contact_number = req.body.contact_number;
    

    db.query(
            "INSERT INTO `submit_your_content` (`title`, `format`, `genre`, `trailer_link`,director_name, `lead_actors`,production_house,email, `contact_number`) VALUES (?,?,?,?,?,?,?,?,?);",
            [title,format,genre,trailer_link,director_name,lead_actors,production_house,email,contact_number],(err, result) => {
            if (err) {
                res.send(200, { message: '2',status:"Something went wrong" });
            } else {
                res.send(200, { message: '1',status:"You content has been submitted successfully" });
            }
        });
    });



ticket_home_router.all('/create-event',(req,res)=>{
    const event_name = req.body.event_name;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const genres = req.body.genres;
    const event_link = req.body.event_link;
    const hear_about = req.body.hear_about;
    const email = req.body.email;
    const contactNumber = req.body.contactNumber;
    const platform = req.body.platform;
    const description = req.body.description;
    const type = "Virtual";
    const event_time = req.body.eventtime;

    db.query(
            "INSERT INTO `event_request` (`event_name`, `start_date`, `end_date`, `genres`, `event_link`,email_address, `hear_about`,contact_number,platform, `description`,type,event_time) VALUES (?, ?, ?, ?, ?,?,?,?, ?, ?, ?);",
            [event_name,start_date,end_date,genres,event_link,email,hear_about,contactNumber,platform,description,type,event_time],(err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });


ticket_home_router.all('/create-event',(req,res)=>{
    const event_name = req.body.event_name;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const genres = req.body.genres;
    const event_link = req.body.event_link;
    const hear_about = req.body.hear_about;
    const email = req.body.email;
    const contactNumber = req.body.contactNumber;
    const platform = req.body.platform;
    const description = req.body.description;
    const type = "Virtual";
    const event_time = req.body.eventtime;

    db.query(
            "INSERT INTO `event_request` (`event_name`, `start_date`, `end_date`, `genres`, `event_link`,email_address, `hear_about`,contact_number,platform, `description`,type,event_time) VALUES (?, ?, ?, ?, ?,?,?,?, ?, ?, ?);",
            [event_name,start_date,end_date,genres,event_link,email,hear_about,contactNumber,platform,description,type,event_time],(err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });

    ticket_home_router.all('/create-event-offline',(req,res)=>{
        const event_name = req.body.event;
        const start_date = req.body.startDate;
        const end_date = req.body.endDate;
        const address = req.body.address;
        const email = req.body.email;
        const artistBudget = req.body.artistBudget;
        const contactNumber = req.body.contactNumber;
        const description = req.body.description;
        const type = "Offline";
        const event_time = req.body.eventtime;
    
        db.query(
                "INSERT INTO `event_request` (`event_name`, `start_date`, `end_date`, `venue_address`, `artist_budget`,email_address,contact_number, `description`,type,event_time) VALUES (?, ?, ?, ?, ?,?,?,?, ?, ?);",
                [event_name,start_date,end_date,address,artistBudget,email,contactNumber,description,type,event_time],(err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            });
        });

    ticket_home_router.all('/event-requests',(req,res)=>{
        db.query("SELECT * FROM `event_request` ORDER BY `event_request`.`event_req_id` DESC", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });

    ticket_home_router.all('/add-slider', upload.single('slider'), (req, res, next) => {
        //console.log(req);

        var img = 'images/' + req.file.filename;
        var text = req.body.text;
        var description = req.body.description;
        var duration = req.body.duration;
        var price = req.body.price;
        var year = req.body.year;
        var status = "1";
        var bg_image = "bg_image";
        db.query("INSERT INTO slider(image,bg_image,text,description,duration,year,price,status) values(?,?,?,?,?,?,?,?)",[img,bg_image,text,description,duration,year,price,status], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });

    })

    ticket_home_router.all('/updateinfo',(req,res)=>{
        const shop_name=req.body.formdata.shop_name;
        const email=req.body.formdata.email;
        const Whatsapp=req.body.formdata.Whatsapp;
        const Number=req.body.formdata.Number;
        const Facebook=req.body.formdata.Facebook;
        const Instagram=req.body.formdata.Instagram;
        const Twitter=req.body.formdata.Twitter;
        const Youtube=req.body.formdata.Youtube;
        const appstore=req.body.formdata.appstore;
        const playstore=req.body.formdata.playstore;
        const about=req.body.formdata.about;
        const footer=req.body.formdata.footer;
        const privacy=req.body.formdata.privacy;
        const refund=req.body.formdata.refund;
        const cancel=req.body.formdata.cancel;
        const create_event=req.body.formdata.create_event;
        const findmytoken=req.body.formdata.findmytoken;
        const buytickets=req.body.formdata.buytickets;
        const hostshow=req.body.formdata.hostshow;
        db.query("UPDATE INFO set shop_name= ?,email=?,whatsapp=?,phone=?,facebook=?,instagram=?,twitter=?,youtube=?,appstore=?,playstore=?,about_us=?,footer_text=?,privacy=?,refund=?,cancel=?,create_event_text=?,find_my_token_text=?,how_to_buy_tickets=?,how_to_host_shows=?",
        [shop_name,email,Whatsapp,Number,Facebook,Instagram,Twitter,Youtube,appstore,playstore,about,footer,privacy,refund,cancel,create_event,findmytoken,buytickets,hostshow], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
    


export default ticket_home_router;
