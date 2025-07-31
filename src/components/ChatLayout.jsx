// ChatLayout.js
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useAuth } from './AuthContext';

export default function ChatLayout() {
  const { logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState('John'); // Default or from URL/context

  // --- State for messages and groups (could be moved to context later) ---
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

  // --- State for dynamic user data ---
  const [allUsersData, setAllUsersData] = useState([]); // Stores fetched user objects
  const [loadingUsers, setLoadingUsers] = useState(true); // Loading state
  const [errorUsers, setErrorUsers] = useState(null); // Error state

  // --- Fetch users from API ---
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        // --- Get access token from localStorage ---
        const accessToken = localStorage.getItem('accessToken'); // ✅ Match the key from AuthContext

        if (!accessToken) {
          throw new Error('No access token found. Please log in.');
        }

        const response = await fetch('http://127.0.0.1:8000/users/get/all/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Add Bearer token
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Handle specific error cases like 401 Unauthorized
          if (response.status === 401) {
             // Token might be expired, trigger logout or refresh flow
             console.error("Unauthorized access - Token might be invalid or expired.");
             logout(); // Or handle refresh token logic here
             throw new Error('Unauthorized. Please log in again.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform API data
        const transformedUsers = data.map(user => ({
          id: user.id,
          name: user.full_name || user.username,
          username: user.username,
          avatar: user.profile_image ? `http://127.0.0.1:8000${user.profile_image}` : null,
          status: user.status || 'Available',
        }));

        setAllUsersData(transformedUsers);
        setLoadingUsers(false);
      } catch (err) {
        console.error("Failed to fetch users in ChatLayout:", err);
        setErrorUsers(err.message);
        setLoadingUsers(false);
        // Handle error (e.g., show message, redirect to login if 401)
        // You might want to trigger logout if it's an auth error
        if (err.message.includes('Unauthorized') || err.message.includes('token')) {
             // logout(); // Example: logout on auth failure
        }
      }
    };

    fetchUsers();
  }, [logout]); // Add logout to dependencies if it's stable

  // --- Find data for the selected user ---
  const selectedUserData = allUsersData.find(u => u.name === selectedUser) || {
    name: selectedUser,
    avatar: '/img/default-avatar.jpg',
  };

  // --- Find data for group members ---
  const currentMembersData = (groupMembers[selectedUser] || []).map(memberName => {
     if (memberName === 'You') {
         return { name: 'You', avatar: '/img/you.jpg' }; // Adjust path or fetch real 'You' data
     }
     return allUsersData.find(u => u.name === memberName) || { name: memberName, avatar: '/img/default-avatar.jpg' };
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
        // Pass user data for Sidebar if it needs to make its own API calls or for filtering
        allUsersData={allUsersData} // Pass the fetched user data
      />
      {selectedUser && (
        <ChatWindow
          user={selectedUserData}
          messages={currentMessages}
          onSend={handleSend}
          members={currentMembersData}
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