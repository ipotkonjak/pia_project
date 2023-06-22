import cors from 'cors';
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import usersRouter from './routers/users_router';
import workshopsRouter from './routers/workshops_router';
import chatsRouter from './routers/chats_router';


const app = express();
app.use(cors())
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/pia_project")
const connection=mongoose.connection
connection.once('open',()=>{
    console.log('db connection ok')
})

const router=Router()

router.use('/users',usersRouter)
router.use('/workshops',workshopsRouter)
router.use('/chats', chatsRouter)
app.use('/',router)

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(4000, () => console.log(`Express server running on port 4000`));
