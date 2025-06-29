import './App.css';
import { TodoForm, TodoItem, Chatbot } from './components';
import { TodoProvider, useTodo } from './contexts/TodoContext';

function App() {
  return (
    <TodoProvider>
      <div className="bg-[#172842] min-h-screen py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto h-[90vh]">
          {/* Todo Application */}
          <div className="flex-1 shadow-md rounded-lg px-4 py-3 text-white bg-[#1e2a47] flex flex-col">
            <h1 className="text-2xl font-bold text-center mb-4">
              Manage Your Todos
            </h1>
            <div className="mb-4">
              <TodoForm />
            </div>

            <TodoList />
          </div>

          {/* Chatbot Section */}
          <div className="w-full lg:w-1/3 shadow-md rounded-lg px-4 py-3 text-white bg-[#1e2a47]">
            <Chatbot />
          </div>
        </div>
      </div>
    </TodoProvider>
  );
}

const TodoList = () => {
  const { todos } = useTodo();

  return (
    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
      {todos.map((todo) => (
        <div key={todo._id} className="w-full">
          <TodoItem todo={todo} />
        </div>
      ))}
    </div>
  );
};

export default App;
