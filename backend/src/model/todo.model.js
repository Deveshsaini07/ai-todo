import mongoose,{Schema} from "mongoose";

const todoSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})

const Todo = mongoose.model("Todo",todoSchema);

export default Todo;