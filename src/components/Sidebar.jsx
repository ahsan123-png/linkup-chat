// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import UserProfilePopup from './UserProfilePopup';
import CreateGroupPopup from './CreateGroupPopup';
import { useAuth } from './AuthContext';

export default function Sidebar({ users, selectedUser, onSelectUser, allUsersData = [] }) {
  // pickup data from user login and use here in sidebar like user id and image etc
  const { userData } = useAuth();
  const BASE_URL='http://127.0.0.1:8000';
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const profileImageUrl = storedUser?.profile_image
  ? `${BASE_URL}${storedUser.profile_image}`
  : 'https://via.placeholder.com/150';
  console.log("Logged in user info:", userData);

  // State for popups
  // Profile popup for current user
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isCreateGroupPopupOpen, setIsCreateGroupPopupOpen] = useState(false);
   // fallback image
  // --- State for dynamic user data (if Sidebar fetches independently) ---
  // Note: ChatLayout now passes allUsersData, so Sidebar might not need to fetch again
  // unless it needs a different or more frequent update.
  // For now, let's rely on the data passed from ChatLayout.
  const [dynamicUsers, setDynamicUsers] = useState(allUsersData); // Use prop or fetch if needed
  const [loadingUsers, setLoadingUsers] = useState(false); // Initially false if relying on prop
  const [errorUsers, setErrorUsers] = useState(null);

  // --- Sync dynamicUsers state if allUsersData prop changes ---
  useEffect(() => {
    setDynamicUsers(allUsersData);
    // Reset loading/error if new data comes in?
    // setLoadingUsers(false);
    // setErrorUsers(null);
  }, [allUsersData]);

  // --- Mock current user data (should ideally come from AuthContext or props) ---
  // This part still needs to be dynamic. You might pass the current user's data
  // from ChatLayout or fetch it based on the token.
  // Let's assume you have a way to identify the current user from the fetched list
  // or AuthContext provides the username/full_name.
  // For demonstration, let's try to get it from localStorage user data or AuthContext.
  // This logic might need refinement based on your `useAuth` context structure.
  
  const [currentUser, setCurrentUser] = useState({
    name: 'Loading User...', // Initial placeholder
    status: 'Hey there! I am using this app.',
    avatar: 'src/img/avatar.png', // Initial placeholder
  });

  // Effect to set currentUser based on fetched data or auth context
  useEffect(() => {
    // Example: Get current user identifier from localStorage or useAuth
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    const authUserName = storedUserData?.full_name || storedUserData?.username; // Adjust based on your stored user structure

    if (authUserName && dynamicUsers.length > 0) {
      // Find the current user in the fetched list
      const foundCurrentUser = dynamicUsers.find(u => u.name === authUserName || u.username === authUserName);
      if (foundCurrentUser) {
        setCurrentUser({
          name: foundCurrentUser.name,
          status: foundCurrentUser.status || 'Available',
          avatar: foundCurrentUser.avatar,
        });
      } else {
        // Fallback if user not found in list (shouldn't happen if list is complete)
        console.warn("Current user not found in fetched user list.");
        setCurrentUser({
          name: authUserName,
          status: 'Online',
          // avatar: '/img/default-avatar.jpg', // Or a default path
        });
      }
    } else if (authUserName) {
       // If we have the name but haven't loaded users yet, set name at least
       setCurrentUser(prev => ({ ...prev, name: authUserName }));
    }
  }, [dynamicUsers]); // Re-run when dynamicUsers changes
  // --- Handler functions for the profile popup ---
  const openProfilePopup = () => setIsProfilePopupOpen(true);
  const closeProfilePopup = () => setIsProfilePopupOpen(false);

  const handleSaveProfile = (updatedData) => {
    console.log('Saving profile data:', updatedData);
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
    alert('Profile updated successfully! (This is a demo)');
    // TODO: In a real app, call an API endpoint to update the user's profile
    // This would likely require another authenticated fetch with the token.
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
    console.log('Creating group with data:', groupData);
    const selectedUserData = dynamicUsers.filter(u => groupData.members.includes(u.name));
    console.log('Selected user data for group:', selectedUserData);
    alert(`Group '${groupData.name}' creation requested! (Demo)\nMembers: ${groupData.members.join(', ')}`);
    // TODO: Integrate with ChatLayout or a global state/context to:
    // 1. Add the new group to the chat list
    // 2. Potentially call an API to create the group on the backend (needs auth token)
    // 3. Update messages/groupMembers state if needed
  }

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
                src={profileImageUrl || currentUser.avatar}
                alt={`${currentUser.name}'s Profile`}
                className="w-10 h-10 rounded-full cursor-pointer"
                // onError={(e) => { e.target.src = '/img/default-avatar.jpg'; }}
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
        <div className="mt-4 flex-1 min-h-0 overflow-y-auto sidebar-chat-list">
          {/* Handle loading and error states */}
          {loadingUsers && <div className="p-3 text-gray-400">Loading users...</div>}
          {errorUsers && <div className="p-3 text-red-400">Error loading users: {errorUsers}</div>}

          {/* Render the list of users passed as props or fetched locally */}
          {dynamicUsers?.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-3 border-b border-gray-700 cursor-pointer ${
                selectedUser === user.name
                  ? "bg-[#4CAF50] bg-opacity-20"
                  : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
              }`}
              onClick={() => onSelectUser(user.name)}
            >
              <div className="relative mr-3">
                <img
                  src={user.avatar}
                  alt={`${user.name}'s avatar`}
                  className="w-12 h-12 rounded-full"
                  // onError={(e) => { e.target.src = '/img/default-avatar.jpg'; }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2a2a2a]"></span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{user.name}</span>
                  <span className="text-xs text-gray-400">10:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400 truncate">{user.status}</p>
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    3
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
      <CreateGroupPopup
        isOpen={isCreateGroupPopupOpen}
        onClose={closeCreateGroupPopup}
        availableUsers={dynamicUsers} // Pass the array of user OBJECTS
        onCreateGroup={handleCreateGroup}
      />
    </>
  );
}