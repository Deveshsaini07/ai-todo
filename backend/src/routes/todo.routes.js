import {Router} from "express"
import {
    getAllTodo,
    searchTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
} from '../controller/todo.controller.js'

const router = Router();

router.route('/getAllTodo').get(getAllTodo)
router.route('/searchTodo').get(searchTodo)
router.route('/createTodo').post(createTodo)
router.route('/toggleTodo/:id').post(toggleTodo)
router.route('/updateTodo/:id').post(updateTodo)
router.route('/deleteTodo/:id').post(deleteTodo)

export default router;