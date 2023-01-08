import express from 'express';
import {APP_PORT, DB_URL} from './config';
import errorHandler from './middlewares/errorHandler';
import mongoose from 'mongoose';

const app = express();
import routes from './routes';

// DB Connected
mongoose.connect(DB_URL, {useNewUrlParser:true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Db connected');
})

// Json activated
app.use(express.json());

// Initialised all the routes
app.use('/api',routes)

// middleware import
app.use(errorHandler)

// Server listening on port 5000
app.listen(APP_PORT, ()=> console.log(`listening on port ${APP_PORT}`));