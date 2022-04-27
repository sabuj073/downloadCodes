import cors from 'cors';
import express from 'express';
import db from '../database.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import htmlToText from 'nodemailer-html-to-text';




const auth_router = express.Router();
const saltRounds = 10;
auth_router.use(cors());
auth_router.use(express.json());


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mhsabus073@gmail.com',
      pass: 'antoraprodan'
    }
  });

transporter.use('compile', htmlToText.htmlToText());
  

auth_router.post('/register',(req,res)=>{
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err);
        }
        try {
            db.query(
                "INSERT INTO users (name,email,password) VALUES(?,?,?)",
                [name,email,hash],
                (err,result)=>{
                    if(err){
                        //console.log(err);
                        res.send(200, { message: '2',status:"Email already in use" });
                    }else{
                        console.log(result.affectedRows);
                        res.send(200, { message: result.affectedRows,staus:"Registration successfull." });
                    }
                   
                    
                }
            );
        } catch (error) {
            res.send(200, { message: '2' });
        }
       
    });
});

auth_router.post('/reset-password',(req,res)=>{
    const email= req.body.email;
    const password= req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err);
        }
        try {
            db.query(
                "UPDATE users set password = ? where email = ?",
                [hash,email],
                (err,result)=>{
                    if(err){
                        //console.log(err);
                        res.send(200, { message: '2',status:"Something went wrong" });
                    }else{
                        console.log(result.affectedRows);
                        res.send(200, { message: result.affectedRows,staus:"Password Changed successfully." });
                    }
                   
                    
                }
            );
        } catch (error) {
            res.send(200, { message: '2' });
        }
       
    });
});

auth_router.post('/update-profile',(req,res)=>{
    const email= req.body.email;
    const password= req.body.password;
    const name= req.body.name;
    const number= req.body.number;
    const user_id= req.body.user_id;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err);
        }
        try {
            db.query(
                "UPDATE users set name = ?,number=?,email=?,password=? where user_id = ?",
                [name,number,email,hash,user_id],
                (err,result)=>{
                    if(err){
                        //console.log(err);
                        res.send(200, { message: '2',status:"Something went wrong" });
                    }else{
                        console.log(result.affectedRows);
                        res.send(200, { message: result.affectedRows,staus:"Profile Updated successfully." });
                    }
                   
                    
                }
            );
        } catch (error) {
            res.send(200, { message: '2' });
        }
       
    });
});


auth_router.post('/login',(req,res)=>{
    console.log("Working");
    const email= req.body.email;
    const password= req.body.password;
    bcrypt.hash(password,saltRounds,(err,hash)=>{
        try {
            db.query(
                "SELECT * from users WHERE email = ? or number = ?",
                [email,email],
                (err,result)=>{
                    //

                    if(result.length>0){
                        bcrypt.compare(password, result[0].password, function(err, res_new) {
                            if(res_new){
                                res.send(200, { message: '1',"result":result[0] });
                            }else{
                                res.send(200, { message: '2' ,status:"User Not Found."});
                            }
                        });
                    }else{
res.send(200,{message:'2',status:"User Not Found"});
}
}
            );
        } catch (error) {
            res.send(200, { message: '2' });
        }       
    });
});


auth_router.all('/contact-message',(req,res)=>{
    console.log(req.body.formdata);
    var name = req.body.formdata.name;
    var email = req.body.formdata.email;
    var number = req.body.formdata.number;
    var message = req.body.formdata.message;
    try {
        db.query(
            "SELECT * from info",
            (err,result)=>{
                //

                if(result.length>0){
                    const email_id = result[0].email;
                    console.log(email_id);
                    var mailOptions = {
                        from: 'noreply@chillhall.com',
                        to: email_id,
                        subject: 'Text from users | '+ result[0].shop_name,
                        html: "<b>Name : </b>"+name+"<br><b>Email : </b>"+email+"<br><b>Number : </b>"+number+"<br><b>Message : </b>"+message
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            res.send(error);
                        } else {
                            res.send(200, { message: 'Your queries has been sent to admin. Thank you.' });
                        }
                      });
                }
}
        );
    } catch (error) {
        res.send(200, { message: '2' });
    }   
});

auth_router.post('/forgot-password',(req,res)=>{
    const email= req.body.email;
        try {
            db.query(
                "SELECT * from users WHERE email = ? or number = ?",
                [email,email],
                (err,result)=>{
                    //

                    if(result.length>0){
                        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
                        var mailOptions = {
                            from: 'noreply@chillhall.com',
                            to: email,
                            subject: 'Password Reset OTP Chillhall.com',
                            text: "Enter this 6 digit code to reset your password \n"+otp
                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                res.send(error);
                            } else {
                                res.send(200, { message: 'OTP has been sent to your email address',otp:otp });
                            }
                          });
                    }else{
res.send(200,{message:'2',status:"User Not Found"});
}
}
            );
        } catch (error) {
            res.send(200, { message: '2' });
        }       
});

export default auth_router;
