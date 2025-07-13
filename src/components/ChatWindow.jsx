import React, { useState } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: 'John', text: 'Hello!' },
    { sender: 'You', text: 'Hi! 👋' },
  ]);

  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;

    setMessages([...messages, { sender: 'You', text: input }]);
    setInput('');
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 border-b">
        <h3 className="font-semibold text-lg">John Doe</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl shadow max-w-xs ${
              msg.sender === 'You'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-white text-black'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 outline-none mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
