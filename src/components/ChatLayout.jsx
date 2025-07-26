// ChatLayout.js
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

  // Use relative paths from the project's public directory
  // Ensure these files exist in your project's `public/img/` folder
  const [profilePictures] = useState({
    John: 'src/img/jhon.jpg',       // Path relative to public folder
    Alice: 'src/img/alice.jpg',
    'Dev Team 👨‍💻': 'src/img/user4.jpg',
    'You': '/img/you.jpg',       // Avatar for the current user in 1:1 chats if needed
    // Default fallback can be handled in ChatWindow
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
  
  // Get the profile picture URL for the selected user
  const currentUserProfilePic = profilePictures[selectedUser] || '/img/default-avatar.jpg'; // Provide a default

  return (
    <div className="flex h-screen">
      {/* Ensure Sidebar correctly receives selectedUser value, not the setter */}
      <Sidebar 
        users={chatList} 
        selectedUser={selectedUser} // Pass the value, not the setter
        onSelectUser={setSelectedUser} 
      />

      {selectedUser && (
        <ChatWindow
          user={selectedUser}
          messages={currentMessages}
          onSend={handleSend}
          members={currentMembers}
          profilePic={currentUserProfilePic} // Pass the profile picture URL
        />
      )}

      <div className="absolute top-2 right-2">
        <button
          onClick={logout}
          className="px-5 py-2 w-full max-w-[120px] bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-md "
        >
          Logout
        </button>
      </div>
    </div>
  );
}