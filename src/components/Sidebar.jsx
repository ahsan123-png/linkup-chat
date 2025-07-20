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
              className="w-10 h-10 rounded-full"
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

      <h2 className="text-xl font-bold my-4">Chats</h2>

      <div className="p-2 bg-[#1f1f1f]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="mb-9 w-full py-2 pl-10 pr-4 bg-[#1F1F1F] text-white rounded-lg focus:outline-none"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {users?.map((user) => (
          <div
            key={user}
            className={`p-3 rounded-lg cursor-pointer ${
              selectedUser === user
                ? 'bg-[#4CAF50]'
                : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
            }`}
            onClick={() => onSelectUser(user)}
          >
            {user}
          </div>
        ))}
      </div>
    </div>
  );
}
