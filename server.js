import cors from 'cors';
import express from 'express';
import path from 'path';
import './database.js';
import ticket_home_router from './routes/ticket_home.js';
import auth_router from './routes/auth.js';
import pay_router from './routes/payment.js';

const app = express();
app.use(cors());
app.use("/ticket/home", ticket_home_router);
app.use("/auth", auth_router);
app.use("/payment", pay_router);

const __dirname = path.resolve();
app.use(express.static(__dirname + '/public/'));


app.get('/', (req, res) => {
    res.send("Server is ready");
});

app.listen(5000, () => {
    console.log('Serve at http://localhost:5000');
})