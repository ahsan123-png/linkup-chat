import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useAuth } from './AuthContext';

export default function ChatLayout() {
  const { logout } = useAuth();

  const [selectedUser, setSelectedUser] = useState('John');
  const [messages, setMessages] = useState({
    John: [
      { sender: 'John', text: 'Hey there!' },
      { sender: 'You', text: 'Hi John 👋' },
    ],
    Alice: [
      { sender: 'Alice', text: 'Hello!' },
      { sender: 'You', text: 'Hi Alice!' },
    ],
    'Dev Team 👨‍💻': [
      { sender: 'Alice', text: 'Hey everyone!' },
      { sender: 'John', text: 'Good morning team' },
      { sender: 'You', text: 'Hello 👋' },
    ],
  });

  const [groupMembers] = useState({
    'Dev Team 👨‍💻': ['You', 'Alice', 'John'],
  });

  const handleSend = (newMessage) => {
    setMessages((prev) => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), newMessage],
    }));
  };

  const chatList = Object.keys(messages);
  const currentMessages = messages[selectedUser] || [];
  const currentMembers = groupMembers[selectedUser] || [];

  return (
    <div className="flex h-screen">
      <Sidebar users={chatList} selectedUser={selectedUser} onSelectUser={setSelectedUser} />

      {selectedUser && (
        <ChatWindow
          user={selectedUser}
          messages={currentMessages}
          onSend={handleSend}
          members={currentMembers}
        />
      )}

      <div className="absolute top-2 right-2">
        <button
          onClick={logout}
          className="px-5 py-2 w-full max-w-[120px] bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-md align-middle"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
