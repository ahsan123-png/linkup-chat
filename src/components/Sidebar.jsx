// Sidebar.jsx
import React, { useState } from 'react';
import UserProfilePopup from './UserProfilePopup';
import CreateGroupPopup from './CreateGroupPopup'; // Import the new component

export default function Sidebar({ users, selectedUser, onSelectUser }) {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isCreateGroupPopupOpen, setIsCreateGroupPopupOpen] = useState(false); // State for group popup

  // --- Mock current user data ---
  const [currentUser, setCurrentUser] = useState({
    name: 'John Doe',
    status: 'Hey there! I am using this app.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  });

  // --- Handler functions for the profile popup ---
  const openProfilePopup = () => setIsProfilePopupOpen(true);
  const closeProfilePopup = () => setIsProfilePopupOpen(false);

  const handleSaveProfile = (updatedData) => {
    console.log('Saving profile data:', updatedData);
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
    alert('Profile updated successfully! (This is a demo)');
  };

  const handleGoToSettings = () => {
    console.log('Navigating to settings...');
    closeProfilePopup();
    alert('Navigate to Settings action triggered! (This is a demo)');
  };

  // --- Handler functions for the create group popup ---
  const openCreateGroupPopup = () => setIsCreateGroupPopupOpen(true);
  const closeCreateGroupPopup = () => setIsCreateGroupPopupOpen(false);

  // Handle the creation of a new group (you'll define the actual logic)
  const handleCreateGroup = (groupData) => {
    console.log('Creating group with data:', groupData);
    // Example: Add the new group to the chat list or state in ChatLayout
    // This requires lifting state up to ChatLayout or using context
    alert(`Group '${groupData.name}' creation requested! (Demo)\nMembers: ${groupData.members.join(', ')}`);
    // TODO: Integrate with ChatLayout to add the group to messages/chatList
  };


  return (
    <>
      <div className="w-1/4 bg-[#1f1f1f] text-white p-4">
        {/* Profile Header Section */}
        <div
          className="bg-[#1F1F1F] p-3 flex justify-between items-center text-black rounded-lg mb-5 cursor-pointer hover:bg-[#2a2a2a] transition"
          onClick={openProfilePopup}
        >
          <div className="flex items-center space-x-3 text-white">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt="Profile"
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

        {/* Search Bar and Chats Header */}
        <div className="p-4 bg-[#1f1f1f]">
          <div className="relative mb-4"> {/* Added mb-4 for spacing */}
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
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400  cursor-pointer"></i>
          </div>
          {/* Chats Header with Create Group Button */}
          <div className="flex justify-between items-center mt-4"> {/* Added mt-4 for spacing */}
            <h2 className="text-xl font-bold">Chats</h2>
            {/* Create Group Icon Button */}
            <button
              onClick={openCreateGroupPopup}
              className="p-2 rounded-full hover:bg-[#2a2a2a] text-gray-400 hover:text-white transition"
              aria-label="Create Group"
            >
              <i className="fas fa-users"></i> {/* Requires Font Awesome */}
              {/* Or use text: <span className="text-lg">+</span> */}
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="space-y-0 mt-4">
          {users?.map((user) => (
            <div
              key={user}
              className={`flex items-center p-3 border-b border-gray-700 cursor-pointer ${
                selectedUser === user
                  ? "bg-[#4CAF50] bg-opacity-20"
                  : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="relative mr-3">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user)}`}
                  alt={user}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => { e.target.src = '/img/default-avatar.jpg'; }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2a2a2a]"></span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{user}</span>
                  <span className="text-xs text-gray-400">10:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400 truncate">Hey, how are you?</p>
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
      {/* Pass the list of users for selection and the creation handler */}
      <CreateGroupPopup
        isOpen={isCreateGroupPopupOpen}
        onClose={closeCreateGroupPopup}
        availableUsers={users} // Pass the list of users to select from
        onCreateGroup={handleCreateGroup} // Pass the handler for group creation
      />
    </>
  );
}