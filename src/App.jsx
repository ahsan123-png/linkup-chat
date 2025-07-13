import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
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

  const [groupMembers, setGroupMembers] = useState({
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
      <Sidebar
        users={chatList}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />

      {selectedUser && (
        <ChatWindow
          user={selectedUser}
          messages={currentMessages}
          onSend={handleSend}
          members={currentMembers}
        />
      )}
    </div>
  );
}

export default App;
