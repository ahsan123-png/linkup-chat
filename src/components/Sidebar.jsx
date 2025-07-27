// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import UserProfilePopup from './UserProfilePopup';
import CreateGroupPopup from './CreateGroupPopup';

export default function Sidebar({ users, selectedUser, onSelectUser }) {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isCreateGroupPopupOpen, setIsCreateGroupPopupOpen] = useState(false);

  // --- State for dynamic user data ---
  const [dynamicUsers, setDynamicUsers] = useState([]); // Stores fetched user objects
  const [loadingUsers, setLoadingUsers] = useState(true); // Loading state
  const [errorUsers, setErrorUsers] = useState(null); // Error state

  // --- Mock current user data (for profile popup) ---
  // In a real app, this should also ideally come from the API/Auth
  const [currentUser, setCurrentUser] = useState({
    name: 'John Doe', // Placeholder, should be dynamic
    status: 'Hey there! I am using this app.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Placeholder, should be dynamic
  });

  // --- Fetch users from API ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/get/all/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Transform API data into the format needed by the UI
        const transformedUsers = data.map(user => ({
          id: user.id,
          name: user.full_name || user.username, // Use full_name, fallback to username
          username: user.username, // Keep username for potential use
          avatar: user.profile_image ? `http://127.0.0.1:8000${user.profile_image}` : '/img/default-avatar.jpg', // Prefix with base URL and add fallback
          status: user.status || 'Available', // Use status or default
        }));

        setDynamicUsers(transformedUsers);
        setLoadingUsers(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setErrorUsers(err.message);
        setLoadingUsers(false);
        // Optionally, set some default users or show an error message in the UI
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this runs once on mount

  // --- Handler functions for the profile popup ---
  const openProfilePopup = () => setIsProfilePopupOpen(true);
  const closeProfilePopup = () => setIsProfilePopupOpen(false);

  const handleSaveProfile = (updatedData) => {
    console.log('Saving profile ', updatedData);
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
    alert('Profile updated successfully! (This is a demo)');
    // TODO: In a real app, call an API endpoint to update the user's profile
  };

  const handleGoToSettings = () => {
    console.log('Navigating to settings...');
    closeProfilePopup();
    alert('Navigate to Settings action triggered! (This is a demo)');
    // TODO: Implement actual navigation
  };

  // --- Handler functions for the create group popup ---
  const openCreateGroupPopup = () => setIsCreateGroupPopupOpen(true);
  const closeCreateGroupPopup = () => setIsCreateGroupPopupOpen(false);

  const handleCreateGroup = (groupData) => {
    console.log('Creating group with ', groupData);
    // Example: Log the selected user objects based on names
    const selectedUserData = dynamicUsers.filter(u => groupData.members.includes(u.name));
    console.log('Selected user data for group:', selectedUserData);

    alert(`Group '${groupData.name}' creation requested! (Demo)\nMembers: ${groupData.members.join(', ')}`);
    // TODO: Integrate with ChatLayout or a global state/context to:
    // 1. Add the new group to the chat list
    // 2. Potentially call an API to create the group on the backend
    // 3. Update messages/groupMembers state if needed
  };


  return (
    <>
      {/* Main Sidebar Container - Flex Column to manage internal layout */}
      <div className="flex flex-col w-1/4 bg-[#1f1f1f] text-white p-4 h-screen">
        
        {/* Profile Header Section - Fixed at the top */}
        <div
          className="bg-[#1F1F1F] p-3 flex justify-between items-center text-black rounded-lg mb-5 cursor-pointer hover:bg-[#2a2a2a] transition flex-shrink-0"
          onClick={openProfilePopup}
        >
          <div className="flex items-center space-x-3 text-white">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={`${currentUser.name}'s Profile`}
                className="w-10 h-10 rounded-full cursor-pointer"
                onError={(e) => { e.target.src = '/img/default-avatar.jpg'; }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="font-semibold">{currentUser.name}</span>
          </div>
          <div className="flex space-x-4 text-gray-500">
          </div>
        </div>

        {/* Search Bar and Chats Header - Fixed below profile */}
        <div className="p-4 bg-[#1f1f1f] flex-shrink-0">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search or start new chat"
              className="
          w-full
          py-2
          pl-10
          pr-4
          bg-[#1f1f1f]
          text-white
          placeholder-gray-400
          border-b-2
          border-green-500
          focus:bg-black
          focus:outline-none
          transition-colors
          duration-200
          "
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"></i>
          </div>
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-xl font-bold">Chats</h2>
            <button
              onClick={openCreateGroupPopup}
              className="p-2 rounded-full hover:bg-[#2a2a2a] text-gray-400 hover:text-white transition"
              aria-label="Create Group"
            >
              <i className="fas fa-users"></i>
            </button>
          </div>
        </div>

        {/* Chat List Container - Takes remaining space and scrolls */}
        {/* mt-4 for spacing, flex-1 to fill remaining space, overflow-y-auto for scrollbar */}
        <div className="mt-4 flex-1 min-h-0 overflow-y-auto"> 
          {/* Handle loading and error states for user list */}
          {loadingUsers && <div className="p-3 text-gray-400">Loading users...</div>}
          {errorUsers && <div className="p-3 text-red-400">Error loading users: {errorUsers}</div>}
          
          {/* Render ONLY the dynamic list of users fetched from API */}
          {dynamicUsers?.map((user) => (
             <div
               key={user.id} // Use unique user ID as key
               className={`flex items-center p-3 border-b border-gray-700 cursor-pointer ${
                 selectedUser === user.name // Compare with user.name
                   ? "bg-[#4CAF50] bg-opacity-20"
                   : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
               }`}
               onClick={() => onSelectUser(user.name)} // Pass the user's name back to ChatLayout
             >
               <div className="relative mr-3">
                 <img
                   src={user.avatar} // Use avatar from dynamic data
                   alt={`${user.name}'s avatar`}
                   className="w-12 h-12 rounded-full"
                   onError={(e) => { e.target.src = '/img/default-avatar.jpg'; }} // Fallback on error
                 />
                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2a2a2a]"></span>
               </div>

               <div className="flex-1">
                 <div className="flex justify-between items-center">
                   <span className="font-semibold text-white">{user.name}</span>
                   <span className="text-xs text-gray-400">10:30 AM</span> {/* Placeholder time */}
                 </div>
                 <div className="flex justify-between items-center">
                   <p className="text-sm text-gray-400 truncate">{user.status}</p> {/* Use status */}
                   {/* Placeholder unread count */}
                   <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                     {/* {unreadCount} */} 3
                   </span>
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* Render the User Profile Popup */}
      <UserProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={closeProfilePopup}
        currentUser={currentUser}
        onSave={handleSaveProfile}
        onGoToSettings={handleGoToSettings}
      />

      {/* Render the Create Group Popup */}
      {/* Pass the DYNAMIC list of users (objects) for richer selection and the creation handler */}
      <CreateGroupPopup
        isOpen={isCreateGroupPopupOpen}
        onClose={closeCreateGroupPopup}
        availableUsers={dynamicUsers} // Pass the array of user OBJECTS fetched from API
        onCreateGroup={handleCreateGroup}
      />
    </>
  );
}