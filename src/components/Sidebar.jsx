// Sidebar.jsx
import React, { useState } from 'react';
import UserProfilePopup from './UserProfilePopup'; // Import the new component

export default function Sidebar({ users, selectedUser, onSelectUser }) {
  // State for the user profile popup
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  // --- Mock current user data ---
  // In a real app, this would likely come from AuthContext or a global state
  const [currentUser, setCurrentUser] = useState({
    name: 'John Doe', // Initial name
    status: 'Hey there! I am using this app.', // Initial status
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Initial avatar
  });

  // --- Handler functions for the popup ---
  const openProfilePopup = () => setIsProfilePopupOpen(true);
  const closeProfilePopup = () => setIsProfilePopupOpen(false);

  // Handle saving the updated profile (you'll define the actual save logic)
  const handleSaveProfile = (updatedData) => {
    console.log('Saving profile data:', updatedData);
    // Example: Update local state
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
    // In a real app, you would likely call an API here to persist the changes
    alert('Profile updated successfully! (This is a demo)');
  };

  // Handle navigating to settings (you'll implement this)
  const handleGoToSettings = () => {
    console.log('Navigating to settings...');
    closeProfilePopup(); // Close the popup first
    // Example: You might use useNavigate from react-router-dom here
    // navigate('/settings');
     alert('Navigate to Settings action triggered! (This is a demo)');
  };

  return (
    <>
      <div className="w-1/4 bg-[#1f1f1f] text-white p-4">
        {/* Profile Header Section */}
        <div
          className="bg-[#1F1F1F] p-3 flex justify-between items-center text-black rounded-lg mb-5 cursor-pointer hover:bg-[#2a2a2a] transition"
          onClick={openProfilePopup} // Open popup on click
        >
          <div className="flex items-center space-x-3 text-white">
            <div className="relative">
              <img
                src={currentUser.avatar} // Use avatar from state
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onError={(e) => { e.target.src = '/img/default-avatar.jpg'; }} // Fallback
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="font-semibold">{currentUser.name}</span> {/* Use name from state */}
          </div>
          <div className="flex space-x-4 text-gray-500">
            {/* Optional: Keep these icons or remove if not needed in header */}
            {/* <button className="hover:text-gray-700">
              <i className="fas fa-comment-alt"></i>
            </button>
            <button className="hover:text-gray-700">
              <i className="fas fa-ellipsis-v"></i>
            </button> */}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-[#1f1f1f]">
          <div className="relative">
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
          <h2 className="text-xl font-bold mt-8">Chats</h2>
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
              {/* User Avatar & Online Status */}
              <div className="relative mr-3">
                {/* Placeholder avatar - replace with actual user avatar logic if available */}
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt={user}
                  className="w-12 h-12 rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2a2a2a]"></span>
              </div>

              {/* User Info */}
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
        currentUser={currentUser} // Pass current user data
        onSave={handleSaveProfile} // Pass save handler
        onGoToSettings={handleGoToSettings} // Pass settings handler
      />
    </>
  );
}