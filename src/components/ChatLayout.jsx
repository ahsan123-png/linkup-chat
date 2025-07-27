// ChatLayout.js
import { useState, useEffect } from 'react'; // Added useEffect
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
        const response = await fetch('http://127.0.0.1:8000/users/get/all/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Transform API data
        const transformedUsers = data.map(user => ({
          id: user.id,
          name: user.full_name || user.username,
          username: user.username,
          avatar: user.profile_image ? `http://127.0.0.1:8000${user.profile_image}` : '/img/default-avatar.jpg',
          status: user.status || 'Available',
        }));

        setAllUsersData(transformedUsers);
        setLoadingUsers(false);
      } catch (err) {
        console.error("Failed to fetch users in ChatLayout:", err);
        setErrorUsers(err.message);
        setLoadingUsers(false);
        // Handle error (e.g., show message)
      }
    };

    fetchUsers();
  }, []); // Run once on mount

  // --- Find data for the selected user ---
  // This will be an object like { name, avatar } or null if not found/loading
  const selectedUserData = allUsersData.find(u => u.name === selectedUser) || {
    name: selectedUser, // Fallback to the name if not found (e.g., for groups)
    avatar: '/img/default-avatar.jpg', // Default avatar
  };

  // --- Find data for group members (basic example, might need refinement) ---
  // This assumes member names in groupMembers match user names from the API
  const currentMembersData = (groupMembers[selectedUser] || []).map(memberName => {
     // Special case for 'You' or handle current user logic if needed
     if (memberName === 'You') {
         // You might want to get the actual current user's data here from AuthContext or state
         // For now, using a placeholder
         return { name: 'You', avatar: '/img/you.jpg' };
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
  const currentMembers = groupMembers[selectedUser] || []; // Keep original names for ChatWindow if needed, or pass currentMembersData

  // Get the profile picture URL for the selected user (now from dynamic data)
  // const currentUserProfilePic = profilePictures[selectedUser] || '/img/default-avatar.jpg'; // Removed old static map

  return (
    <div className="flex h-screen">
      <Sidebar
        users={chatList}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        // Pass dynamic user data to Sidebar if needed (e.g., for CreateGroupPopup)
        // dynamicUsers={allUsersData} // Optional: if Sidebar needs the full list
      />

      {selectedUser && (
        <ChatWindow
          // Pass the DYNAMIC user data object instead of just the name
          user={selectedUserData} // Pass object { name, avatar }
          messages={currentMessages}
          onSend={handleSend}
          // Pass the DYNAMIC member data if ChatWindow is updated to use it
          members={currentMembersData} // Pass array of objects [{ name, avatar }, ...]
          // profilePic={currentUserProfilePic} // Removed, now passed via user object
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