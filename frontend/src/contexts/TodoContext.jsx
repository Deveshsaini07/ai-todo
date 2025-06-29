
import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const TodoContext = createContext();

export const useTodo = () => useContext(TodoContext);
const baseUrl = import.meta.env.VITE_API_BASEURL;


export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/todos/getAlltodo`);
      setTodos(response.data.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (data) => {
    const response = await axios.post(`${baseUrl}/api/v1/todos/createTodo`, data);
    const todo = response.data.data;
    setTodos((prev) => [{ ...todo }, ...prev]);
  };

  const updateTodo = async (_id, updatedTodo) => {
    setTodos((prev) =>
      prev.map((item) => (item._id === _id ? updatedTodo : item))
    );
    await axios.post(`${baseUrl}/api/v1/todos/updateTodo/${_id}`, updatedTodo);
  };

  const deleteTodo = async (_id) => {
    setTodos((prev) => prev.filter((item) => item._id !== _id));
    await axios.post(`${baseUrl}/api/v1/todos/deleteTodo/${_id}`);
  };

  const toggleComplete = async (_id) => {
    let completed;
    setTodos((prev) =>
      prev.map((item) => {
        if (item._id === _id) {
          completed = item.completed;
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );
    await axios.post(`${baseUrl}/api/v1/todos/toggleTodo/${_id}`, {
      completed,
    });
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
