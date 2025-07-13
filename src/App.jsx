// Importing React's useState hook for local component state
import { useState } from 'react';

// Importing custom components
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './components/AuthContext';

function App() {
  const { user, logout } = useAuth();
  const [authPage, setAuthPage] = useState('login'); // 'login' or 'register'
  if (!user) {
    return authPage === 'login'
      ? <Login onSwitch={() => setAuthPage('register')} />
      : <Register onSwitch={() => setAuthPage('login')} />;
  }

  // Stores the currently selected user or group in chat
  const [selectedUser, setSelectedUser] = useState('John');

  // Stores messages for each user or group as key-value pairs
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

  // Stores group member information only for group chats
  const [groupMembers, setGroupMembers] = useState({
    'Dev Team 👨‍💻': ['You', 'Alice', 'John'],
  });

  // This function is called when a message is sent from ChatWindow
  // It updates the message list for the selected user or group
  const handleSend = (newMessage) => {
    setMessages((prev) => ({
      ...prev, // Spread previous message state
      [selectedUser]: [...(prev[selectedUser] || []), newMessage], // Append new message
    }));
  };

  // Extracts the list of chat keys (users/groups) to show in sidebar
  const chatList = Object.keys(messages);

  // Retrieves the currently active conversation
  const currentMessages = messages[selectedUser] || [];

  // Retrieves the member list if the selected chat is a group
  const currentMembers = groupMembers[selectedUser] || [];

  // Render the layout
  return (
    <div className="flex h-screen">
      {/* Sidebar component: shows chat list and handles chat selection */}
      <Sidebar
        users={chatList} // List of users/groups to display
        selectedUser={selectedUser} // Currently selected chat
        onSelectUser={setSelectedUser} // Function to update selection
      />

      {/* ChatWindow component: displays messages and input UI */}
      {selectedUser && (
        <ChatWindow
          user={selectedUser} // Passed to show chat title
          messages={currentMessages} // Current message history
          onSend={handleSend} // Function to handle message sending
          members={currentMembers} // Group member list (optional)
        />
      )}
      {/* Logout button */}
      <div className="p-2 text-right">
        <button onClick={logout} className="text-red-500 text-sm">Logout</button>
      </div>
    </div>
  );
}

// Exporting the App component as default so it can be rendered in main.jsx
export default App;