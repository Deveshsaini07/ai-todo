//yaha func immediately call ho jayega


const asyncHandler = (func) => {
    return (req,res,next) => {
        Promise.resolve(func(req,res,next))
        .catch((err) => next(err));        
    }
};
export {asyncHandler};



// const asyncHandler = (func) => async(req,res,next) =>{
//     try {
//         await func(req,res,next);
//     } catch (error) {
//         res.error(error.code || 500).json({
//             success:false,
//             message:error.message
//         });
//         console.log("");
        
//     }
// }