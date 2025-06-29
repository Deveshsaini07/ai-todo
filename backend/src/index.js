import dotenv from 'dotenv';
import connectDb from './db/index.js';
import { app } from './app.js';
import OpenAI from "openai";
import { Pinecone } from '@pinecone-database/pinecone';
import { askChatBot } from "./openAI/openai.js";
import {insertDataInIndex,retriveData} from './pinecone/pinecone.js'
dotenv.config();

dotenv.config({
    path:'./env'
});



const pineconeClient = new Pinecone({
    apiKey:process.env.PINECONE_API_KEY
});
const index = pineconeClient.index('ai-chatbot');


// console.log("result of index creation is",index);

const openai = new  OpenAI({
    apiKey:process.env.OPENAI_API_KEY
})



// const app = express();
// app.use(express.json());
app.post('/api/v1/todos/chat', async (req, res) => {
  const response = await askChatBot(req, res, index, openai);
  // console.log("res is ",res);
  // console.log("response is ",response);
  res.json({
    message:"successfully got the response",
    data:res.data
  });
  
});
app.post('/api/v1/todos/add', async (req, res) => {
  const response = await insertDataInIndex(req,res,index);
  res.json({message:"successfully added the data"});
});

connectDb().then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log('Db not connected:', error);
    process.exit(1);
    
})
