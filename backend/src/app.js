import express from 'express';
import cors from 'cors';

const app = express();
//app is just an object which have all functions of express

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true // This allows cookies to be sent with requests
}));
//.use is a method of express which is used for middleware and config

app.use(express.json({limit: '16kb'}));// to handle json data

//import routes
import todoRouter from './routes/todo.routes.js';

//router declaration
app.use('/api/v1/todos',todoRouter);
// url -> http://localhost:3000//api/v1/todos

export {app};