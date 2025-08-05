import React, { useState, useEffect } from 'react';
import UserProfilePopup from './UserProfilePopup';
import CreateGroupPopup from './CreateGroupPopup';
import { useAuth } from './AuthContext';

export default function Sidebar({ users, selectedUser, onSelectUser, allUsersData = [] }) {
  const { userData, setUserData, logout } = useAuth();

  const handleProfileUpdate = (updatedUser) => {
    const baseURL = "http://127.0.0.1:8000";
    const imageUrl = updatedUser.profile_image
      ? updatedUser.profile_image.includes("http")
        ? updatedUser.profile_image
        : `${baseURL}${updatedUser.profile_image}`
      : null;

    const updated = {
      ...updatedUser,
      profile_image: imageUrl ? `${imageUrl}?t=${Date.now()}` : null,
    };

    setUserData(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setCurrentUser((prev) => ({
      ...prev,
      name: updated.full_name || updated.name || prev.name,
      avatar: updated.profile_image || prev.avatar,
      status: updated.status || prev.status,
    }));
  };

  const BASE_URL = 'http://127.0.0.1:8000';
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const profileImageUrl = storedUser?.profile_image
    ? storedUser.profile_image.includes('http')
      ? storedUser.profile_image
      : `${BASE_URL}${storedUser.profile_image}`
    : 'https://via.placeholder.com/150';

  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isCreateGroupPopupOpen, setIsCreateGroupPopupOpen] = useState(false);
  const [dynamicUsers, setDynamicUsers] = useState(allUsersData);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  useEffect(() => {
    setDynamicUsers(allUsersData);
  }, [allUsersData]);

  const [currentUser, setCurrentUser] = useState({
    name: 'Loading User...',
    status: 'Hey there! I am using this app.',
    avatar: 'src/img/avatar.png',
  });

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    const authUserName = storedUserData?.full_name || storedUserData?.username;

    if (authUserName && dynamicUsers.length > 0) {
      const foundCurrentUser = dynamicUsers.find(u => u.name === authUserName || u.username === authUserName);
      if (foundCurrentUser) {
        setCurrentUser({
          name: foundCurrentUser.name,
          status: foundCurrentUser.status || 'Available',
          avatar: foundCurrentUser.avatar,
        });
      } else {
        console.warn("Current user not found in fetched user list.");
        setCurrentUser({
          name: authUserName,
          status: 'Online',
        });
      }
    } else if (authUserName) {
      setCurrentUser(prev => ({ ...prev, name: authUserName }));
    }
  }, [dynamicUsers]);

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

  const openCreateGroupPopup = () => setIsCreateGroupPopupOpen(true);
  const closeCreateGroupPopup = () => setIsCreateGroupPopupOpen(false);

  const handleCreateGroup = (groupData) => {
    console.log('Creating group with data:', groupData);
    const selectedUserData = dynamicUsers.filter(u => groupData.members.includes(u.name));
    console.log('Selected user data for group:', selectedUserData);
    alert(`Group '${groupData.name}' creation requested! (Demo)\nMembers: ${groupData.members.join(', ')}`);
  };

  return (
    <>
      <div className="flex flex-col w-1/4 bg-[#1f1f1f] text-white p-4 h-screen relative">
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
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="font-semibold">{currentUser.name}</span>
          </div>
        </div>

        <div className="p-4 bg-[#1f1f1f] flex-shrink-0">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full py-2 pl-10 pr-4 bg-[#1f1f1f] text-white placeholder-gray-400 border-b-2 border-green-500 focus:bg-black focus:outline-none transition-colors duration-200"
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

        <div className="mt-4 flex-1 min-h-0 overflow-y-auto sidebar-chat-list pb-20">
          {loadingUsers && <div className="p-3 text-gray-400">Loading users...</div>}
          {errorUsers && <div className="p-3 text-red-400">Error loading users: {errorUsers}</div>}

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

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] border-t border-gray-700 px-4 py-3 flex justify-between items-center text-gray-400 text-sm z-10">
          <span>v1.0.0</span>
          <div className="flex space-x-4">
            <i
              className="fas fa-cog text-lg cursor-pointer transform transition-transform duration-300 hover:scale-110"
              title="Settings"
              onClick={handleGoToSettings}
            ></i>
            <i
              className="fas fa-sign-out-alt text-lg cursor-pointer transform transition-transform duration-300 hover:scale-110"
              title="Logout"
              onClick={logout}
            ></i>
          </div>
        </div>
      </div>

      <UserProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
        currentUser={userData}
        onSave={handleProfileUpdate}
        onGoToSettings={() => console.log("Go to settings clicked")}
      />

      <CreateGroupPopup
        isOpen={isCreateGroupPopupOpen}
        onClose={closeCreateGroupPopup}
        availableUsers={dynamicUsers}
        onCreateGroup={handleCreateGroup}
      />
    </>
  );
}
