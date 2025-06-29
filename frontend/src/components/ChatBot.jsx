import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTodo } from '../contexts/TodoContext';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchTodos } = useTodo();

  useEffect(() => {
    if (!loading) {
      fetchTodos();
    }
  }, [loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/v1/todos/chat', { query: input });
      const botReply = res.data.data;

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: botReply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Something went wrong. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 border border-gray-700 rounded-xl bg-gray-900 text-white p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">AI Chatbot</h2>

      <div className="h-80 overflow-y-auto space-y-3 p-2 bg-gray-800 rounded-md">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-md max-w-xs ${
              msg.sender === 'user'
                ? 'bg-green-600 self-end ml-auto text-right'
                : 'bg-gray-700 self-start mr-auto text-left'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-400">Bot is typing...</div>
        )}
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 p-2 rounded-l-md bg-gray-700 border border-gray-600 focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 rounded-r-md hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
