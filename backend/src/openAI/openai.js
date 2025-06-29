import { retriveData } from "../pinecone/pinecone.js";
import Todo from "../model/todo.model.js";

// Available tools for the assistant

async function getAllTodo() {
   const data=await Todo.find();
   return data;
}

async function searchTodo(query) {
    console.log(typeof query);
    
   const data = await Todo.find({content: { $regex: query, $options: "i" }});
   console.log("dataaaaa", data)
   return data[0];
}

async function toggleTodo(id){
    const data = await Todo.findById(id);
    const value = data.completed;
    const todo = await Todo.findByIdAndUpdate(id,{completed:!value},{new:true});
    return todo;
}

async function createTodo(data){
    const todo = await Todo.create(data);
    return todo;
}

async function updateTodo({id,todo}){
    const data = await Todo.findByIdAndUpdate(id,todo,{new:true});
    return data;
}

async function deleteTodo(id){
    const todo = await Todo.findByIdAndDelete(id);
    return todo;
}

const tools = {
  getAllTodo:getAllTodo,
  searchTodo:searchTodo,
  toggleTodo:toggleTodo,
  createTodo:createTodo,
  updateTodo:updateTodo,
  deleteTodo:deleteTodo
};

// System Prompt for reasoning with tools
const System_Prompt = `
    you are a AI to-do List assistent.you can manage todos by adding, viewing,
    updating, toggling, and deleting.
    However, if the user's question is not related to todos, then return a Result state with "NOT_FOUND" as the response.
    you must strictly follow the JSON output format.

    You are AI assistant with START, PLAN, ACTION, Observation , Output , Result State.
    Wait for user prompt and first PLAN using available tools.
    After Planning, take the action with appropriate tools and wait for
    Observation based on Action.
    then again plan if need and at last return result state.

    Once you get the result state, Return the AI response based on Start 
    prompt and Observation
    

    You must strictly follow the JSON output format and use this reasoning pattern: START → PLAN → ACTION → OBSERVATION → OUTPUT.

    Todo DB Schema:
    - _id: String
    - content: String
    - completed: Boolean

    Available Tools:
    - getAllTodo(): returns a array of all todos from Database
    - searchTodo(query:string): returns todos that match the search query
    - toggleTodo(id:string): toggles the completed status of the todo with the given id
    - createTodo(todo:object): creates a new todo with the given properties and returns the created todo
    - updateTodo(id:string, todo:object): updates the todo with the given id with the new properties and returns the updated todo
    - deleteTodo(id:string): deletes the todo with the given id and returns the deleted todo

    

    Example:
    START
    { "type":"user", "content":"Add a task for shopping for snacks" }
    { "type":"plan", "plan":"I will use createTodo to create a new Todo in DB" }
    { "type":"action", "function":"createTodo", "input":"Shopping for snacks" }
    { "type":"observation", "observation":"{_id:String, content:String, completed:Boolean}" }
    { "type":"output", "output":"Your todo has been added successfully." }
    { "type":"result", "result":"Your todo has been added successfully." }
    
`;

// Completion for answering context-based questions
const contextOnlyCompletion = async (openai, context, query) => {
  const messages = [
    { role: 'system', content: 'Answer the question if the question ask user information in proper sentences. else respond, respond: "NOT_FOUND"' },
    { role: 'user', content: `Context:\n${context}\n\nQuestion: ${query}` },
  ];

  const data = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
  });

  return data.choices[0]?.message.content;
};

// Completion for handling todo operations
const todoBasedCompletion = async (openai, query) => {
  const messages = [
    { role: 'system', content: System_Prompt },
    { role: 'user', content: query }
  ];
  while(true){
    const data = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages:messages,
        response_format:{type:"json_object"},
    });
    const result=data.choices[0]?.message.content;
    console.log("result is:",result);
    
    messages.push({role:"assistant",content:result});

    const action = JSON.parse(result);
    if(action.type==="output"){
        messages.push({role:"developer",content:action.output});

    }
    else if(action.type==="result"){
        return action.result;
    } else if(action.type==="action"){
        const fn = tools[action.function];
        if(!fn) return "NOT_FOUND";
        console.log(action.input);
        
        // const input = JSON.parse(action.input);
        const observation = await fn(action.input);
        // console.log("observation is", observation);
        const observationMessage = {
            type:"observation",
            observation:observation
        }
        messages.push({role:"developer",content:JSON.stringify(observationMessage)});
    }
  }

};

// Main handler
const askChatBot = async (req, res, index, openai) => {
  try {
    const { query } = req.body;

    // 1. Try to retrieve information from Pinecone
    const context = await retriveData(query, index);

    // 2. Try answering from Pinecone context first
    const contextAnswer = await contextOnlyCompletion(openai, context, query);

    // 3. If information was found, return it directly
    if (contextAnswer && !contextAnswer.includes("NOT_FOUND")) {
      res.data = contextAnswer ;
      return;
    }

    // 4. If not found, proceed to handle it as a todo operation
    const todoResponse = await todoBasedCompletion(openai, query);
    res.data = todoResponse;

  } catch (error) {
    console.error("Error in askChatBot:", error);
    res.status(500).send({ error: "Something went wrong." });
  }
};

export { askChatBot };
