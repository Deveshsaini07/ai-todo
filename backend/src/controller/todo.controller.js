import Todo from "../model/todo.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js';

const getAllTodo = asyncHandler(async (req,res) => {
    try {
        const todos = await Todo.find();
        return res.status(200)
        .json(
            new ApiResponse(200,todos,"successfully fetched all todos")
        )
    } catch (error) {
        return res.status(error.statusCode || 500)
        .json(
            {
                success:false,
                message:(error.message || "unable to add comment")
            }
        )
    }
});

const searchTodo = asyncHandler(async (req,res) => {
    try {
        const query = req.body.query;
        // console.log(typeof query);
        
        const todos = await Todo.find({content: { $regex: query, $options: "i" }});
        return res.status(200)
        .json(
            new ApiResponse(200,todos,"successfully fetched todos")
        )
    } catch (error) {
        return res.status(error.statusCode || 500)
        .json(
            {
                success:false,
                message:(error.message || "unable fetched todos")
            }
        )
    }
});

const createTodo = asyncHandler(async (req,res) => {
    try {
        const data = req.body;
        
        const todo = await Todo.create(req.body);
        
        return res.status(200)
        .json(
            new ApiResponse(200,todo,"successfully created todo")
        )
    } catch (error) {
        return res.status(error.statusCode || 500)
        .json(
            {
                success:false,
                message:(error.message || "unable created todo")
            }
        )
    }
});

const updateTodo = asyncHandler(async (req,res) => {
    try {
        console.log(req.body);
        
        const todo = await Todo.findByIdAndUpdate(req.params.id,req.body,{new:true});
        return res.status(200)
        .json(
            new ApiResponse(200,todo,"successfully fetched todos")
        )
    } catch (error) {
        return res.status(error.statusCode || 500)
        .json(
            {
                success:false,
                message:(error.message || "unable fetched todos")
            }
        )
    }
});
const toggleTodo = asyncHandler(async (req,res) => {
    try {
        const data = await Todo.findById(req.params.id);
        const value = data.completed;
        const todo = await Todo.findByIdAndUpdate(req.params.id,{completed:!value},{new:true});
        return res.status(200)
        .json(
            new ApiResponse(200,todo,"successfully toggled todos")
        )
    } catch (error) {
        return res.status(error.statusCode || 500)
        .json(
            {
                success:false,
                message:(error.message || "unable toggled todos")
            }
        )
    }
});

const deleteTodo = asyncHandler(async (req,res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        return res.status(200)
        .json(
            new ApiResponse(200,todo,"successfully deleted todo")
        )
    } catch (error) {
        return res.status(error.statusCode || 500)
        .json(
            {
                success:false,
                message:(error.message || "unable deleted todo")
            }
        )
    }
});

export {getAllTodo,searchTodo,toggleTodo,createTodo,updateTodo,deleteTodo};