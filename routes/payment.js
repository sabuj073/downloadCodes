import cors from 'cors';
import express from 'express';
import db from '../database.js';
import  SSLCommerzPayment from 'sslcommerz-lts';
import { v4 as uuidv4 } from 'uuid';

const pay_router = express.Router();

const store_id = 'chill60b243c0788e2';
const store_passwd = 'chill60b243c0788e2@ssl';
const is_live = false 
pay_router.use(cors());
pay_router.use(express.json());

pay_router.post('/pay',(req,res)=>{
    const data = {
        total_amount: req.body.total,
        currency: (req.body.currency).toUpperCase(),
        tran_id: (new Date()).getTime().toString(36), // use unique tran_id for each api call
        success_url: 'http://localhost:6000/success',
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send(200, { 'GatewayPageURL': GatewayPageURL});
        console.log('Redirecting to: ', GatewayPageURL)
        console.log('currency',(req.body.currency).toUpperCase())
    });
});

pay_router.post('/buy-ticket',(req,res)=>{
    const user_id = req.body.user_id;
    const package_id = req.body.event_id;
    const total_amount = req.body.total_amount;
    const total_screen = req.body.total_screen;
    const currency = (req.body.currency).toUpperCase();
    const data = {
        total_amount: total_amount,
        currency: (req.body.currency).toUpperCase(),
        tran_id: (new Date()).getTime().toString(36), // use unique tran_id for each api call
        success_url: 'http://localhost:6000/success',
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    var token = uuidv4();

    db.query(
        "INSERT INTO `order_data` (`user_id`, `package_id`, `total_amount`, `currency`, `total_screen`, `ticket_token`) VALUES (?, ?, ?, ?, ?, ?);",
        [user_id,package_id,total_amount,currency,total_screen,token],
    );

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send(200, { 'GatewayPageURL': GatewayPageURL});
        console.log('Redirecting to: ', GatewayPageURL)
        console.log('currency',(req.body.currency).toUpperCase())
    });
});

pay_router.post('/success',(req,res)=>{
    return redirect('http://localhost:3000/success');

});

pay_router.post("/find-ticket",(req,res)=>{
    var email = req.body.email_address;
    console.log(email);
    try {
        db.query(
            "SELECT * from order_data,users WHERE order_data.user_id = users.user_id and users.email = ?",
            [email],
            (err,result)=>{
                if(err){
                    //console.log(err);
                    res.send(200, { message: '2',status:"Something went wrong" });
                }else{
                    try{
                        res.send(200, { message: "Found",token:result[0].ticket_token});
                    } catch (error) {
                        res.send(200, { message: 'No ticket found' });
                    }
                        
                }
               
                
            }
        );
    } catch (error) {
        res.send(200, { message: '2' });
    }
});

pay_router.post("/ticket-list",(req,res)=>{
    var user_id = req.body.user_id;
    console.log(user_id);
    try {
        db.query(
            "SELECT * from order_data,users,events WHERE order_data.user_id = users.user_id and events.event_id = order_data.package_id and order_data.user_id =  ?",
            [user_id],
            (err,result)=>{
                if(err){
                    console.log(err);
                    res.send(200, { message: '2',status:"Something went wrong" });
                }else{
                    try{
                        res.send(200, { message: "Found",tickets:result});
                    } catch (error) {
                        res.send(200, { message: 'No ticket found' });
                    }
                        
                }
               
                
            }
        );
    } catch (error) {
        res.send(200, { message: '2' });
    }
});


export default pay_router;