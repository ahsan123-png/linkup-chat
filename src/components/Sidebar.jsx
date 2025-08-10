// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import UserProfilePopup from './UserProfilePopup';
import CreateGroupPopup from './CreateGroupPopup';
import NotificationPopup from './NotificationPopup';
import FriendRequestPopup from './FriendRequestPopup';
import { useAuth } from './AuthContext';

export default function Sidebar({ users, selectedUser, onSelectUser, allUsersData = [] }) {
  const { userData, setUserData, logout } = useAuth();

  // ===== State for dynamic user list =====
  const [dynamicUsers, setDynamicUsers] = useState(allUsersData);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  // ===== Search input state =====
  const [searchQuery, setSearchQuery] = useState("");

  // Update user list from props
  useEffect(() => {
    setDynamicUsers(allUsersData);
  }, [allUsersData]);

  // ===== Handle profile updates =====
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

  // ===== Popup states =====
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isCreateGroupPopupOpen, setIsCreateGroupPopupOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);

  // ===== Notifications & Requests dummy data =====
  const notifications = [
    { message: "New message from John", timestamp: new Date().toISOString() },
    { message: "Task deadline updated", timestamp: new Date().toISOString() },
    { message: "Server restarted", timestamp: new Date().toISOString() },
    { message: "You have a meeting", timestamp: new Date().toISOString() },
    { message: "New project assigned", timestamp: new Date().toISOString() },
    { message: "More than 5 gets scrollable", timestamp: new Date().toISOString() }
  ];


  const friendRequests = [
    { name: "Alice Smith alkosi", timestamp: new Date().toISOString() },
    { name: "Bob", timestamp: new Date().toISOString() },
    { name: "Charlie", timestamp: new Date().toISOString() },
    { name: "Diana", timestamp: new Date().toISOString() },
    { name: "Eve", timestamp: new Date().toISOString() },
    { name: "Frank", timestamp: new Date().toISOString() }
  ];

  const [currentUser, setCurrentUser] = useState({
    name: 'Loading User...',
    status: 'Hey there! I am using this app.',
    avatar: 'src/img/avatar.png',
  });

  // ===== Set current user from localStorage =====
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
        setCurrentUser({ name: authUserName, status: 'Online' });
      }
    } else if (authUserName) {
      setCurrentUser(prev => ({ ...prev, name: authUserName }));
    }
  }, [dynamicUsers]);

  // ===== Search API Call =====
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      // Reset to full list when cleared
      setDynamicUsers(allUsersData);
      return;
    }

    try {
      setLoadingUsers(true);
      // Get token from localStorage or AuthContext
      const token = localStorage.getItem("accessToken"); 
    // Or: const token = userData?.token;  // if you store it in AuthContext

    const response = await fetch(
      `http://127.0.0.1:8000/users/search_user?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // add token
        },
      }
    );
      // if (!response.ok) throw new Error("Failed to search users");
      const data = await response.json();
      setDynamicUsers(data);
    } catch (error) {
      setErrorUsers(error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ===== Clear search =====
  const clearSearch = () => {
    setSearchQuery("");
    setDynamicUsers(allUsersData);
  };

  // ===== Toggle popups =====
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowFriendRequests(false);
  };

  const toggleFriendRequests = () => {
    setShowFriendRequests(!showFriendRequests);
    setShowNotifications(false);
  };

  return (
    <>
      <div className="flex flex-col w-1/4 bg-[#1f1f1f] text-white p-4 h-screen relative">
        
        {/* ===== Top Profile Bar ===== */}
        <div className="bg-[#1F1F1F] p-3 flex justify-between items-center rounded-lg mb-5">
          <div className="flex items-center space-x-3 text-white">
            <div className="relative" onClick={() => setIsProfilePopupOpen(true)}>
              <img
                src={profileImageUrl || currentUser.avatar}
                alt={`${currentUser.name}'s Profile`}
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="font-semibold">{currentUser.name}</span>
          </div>

          {/* Notifications & Friend Requests */}
          <div className="flex items-center gap-3 text-gray-100">
            <div className="relative">
              <button onClick={toggleNotifications} className="relative p-2 rounded-full hover:bg-[#2a2a2a]">
                <i className="fa-solid fa-bell"></i>
                <span className="absolute top-0 right-0 bg-red-500 text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
              {showNotifications && <NotificationPopup notifications={notifications} />}
            </div>

            <div className="relative">
              <button onClick={toggleFriendRequests} className="relative p-2 rounded-full hover:bg-[#2a2a2a]">
                <i className="fa-solid fa-user-plus"></i>
                <span className="absolute top-0 right-0 bg-red-500 text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {friendRequests.length}
                </span>
              </button>
              {showFriendRequests && <FriendRequestPopup requests={friendRequests} />}
            </div>
          </div>
        </div>

        {/* ===== Search Bar ===== */}
        <div className="p-4 bg-[#1f1f1f] flex-shrink-0">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full py-2 pl-10 pr-8 bg-[#1f1f1f] text-white placeholder-gray-400 border-b-2 border-green-500 focus:bg-black focus:outline-none"
            />
            {/* Search Icon */}
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            {/* Clear (✕) Icon */}
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Chats Header */}
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-xl font-bold">Chats</h2>
            <button
              onClick={() => setIsCreateGroupPopupOpen(true)}
              className="p-2 rounded-full hover:bg-[#2a2a2a] text-gray-400 hover:text-white"
            >
              <i className="fas fa-users"></i>
            </button>
          </div>
        </div>

        {/* ===== Chat List ===== */}
        <div className="mt-4 flex-1 min-h-0 overflow-y-auto sidebar-chat-list">
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            
            {/* Static AI Bot */}
            <div
              className="flex items-center p-3 border-b border-gray-700 cursor-pointer bg-[#2a2a2a] hover:bg-[#3a3a3a]"
              onClick={() => onSelectUser("Linko")}
            >
              <div className="relative mr-3">
                <img src="src/img/ai.png" alt="Linko Bot" className="w-12 h-12 rounded-full" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Linko</span>
                  <span className="text-xs text-gray-400">Now</span>
                </div>
                <p className="text-sm text-gray-400 truncate">Hi, I am Linko. How may I help you!</p>
              </div>
            </div>

            {/* Loading / Error / No Results */}
            {loadingUsers && <div className="p-3 text-gray-400">Loading users...</div>}
            {errorUsers && <div className="p-3 text-red-400">{errorUsers}</div>}
            {!loadingUsers && dynamicUsers?.length === 0 && (
              <div className="p-3 text-gray-400">No users available</div>
            )}

            {/* Dynamic Users */}
            {dynamicUsers?.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-3 border-b border-gray-700 cursor-pointer ${
                  selectedUser === user.name ? "bg-[#4CAF50] bg-opacity-20" : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
                }`}
                onClick={() => onSelectUser(user.name)}
              >
                <div className="relative mr-3">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs text-gray-400">10:30 AM</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{user.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="absolute bottom-0 left-0 w-full bg-[#1f1f1f] border-t border-gray-700 px-4 py-3 flex justify-between items-center text-gray-400 text-sm">
          <span>v1.0.0</span>
          <div className="flex space-x-4">
            <i className="fas fa-cog cursor-pointer hover:scale-110" onClick={() => alert("Settings")}></i>
            <i className="fas fa-sign-out-alt cursor-pointer hover:scale-110" onClick={logout}></i>
          </div>
        </div>
      </div>

      {/* Popups */}
      <UserProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
        currentUser={userData}
        onSave={handleProfileUpdate}
      />
      <CreateGroupPopup
        isOpen={isCreateGroupPopupOpen}
        onClose={() => setIsCreateGroupPopupOpen(false)}
        availableUsers={dynamicUsers}
        onCreateGroup={(group) => console.log(group)}
      />
    </>
  );
}
