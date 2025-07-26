import React from 'react';

export default function Sidebar({ users, selectedUser, onSelectUser }) {
  return (
    <div className="w-1/4 bg-[#1f1f1f] text-white p-4">
      <div className="bg-[#1F1F1F] p-3 flex justify-between items-center text-black rounded-lg mb-5">
        <div className="flex items-center space-x-3 text-white">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <span className="font-semibold">John Doe</span>
        </div>
        <div className="flex space-x-4 text-gray-500">
          <button className="hover:text-gray-700">
            <i className="fas fa-comment-alt"></i>
          </button>
          <button className="hover:text-gray-700">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>


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

<div className="space-y-0 mt-4"> {/* Changed space-y-3 to space-y-0 for no gap between items */}
  {users?.map((user) => (
    <div
      key={user} // Keep your original key if users are strings
      className={`flex items-center p-3 border-b border-gray-700 cursor-pointer ${
        selectedUser === user
          ? "bg-[#4CAF50] bg-opacity-20" // Selected state (semi-transparent green)
          : "bg-[#2a2a2a] hover:bg-[#3a3a3a]" // Default & hover state
      }`}
      onClick={() => onSelectUser(user)}
    >
      {/* User Avatar & Online Status */}
      <div className="relative mr-3">
        <img
          src="https://randomuser.me/api/portraits/men/1.jpg" // Default avatar (replace with user.avatar if available)
          alt={user}
          className="w-12 h-12 rounded-full"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2a2a2a]"></span>
      </div>

      {/* User Info (Name, Last Message, Time) */}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-white">{user}</span> {/* Username */}
          <span className="text-xs text-gray-400">10:30 AM</span> {/* Time */}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400 truncate">Hey, how are you?</p> {/* Last message preview */}
          <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            3 {/* Unread count */}
          </span>
        </div>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}