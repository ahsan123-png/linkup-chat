import React from 'react';

export default function Sidebar({ users, selectedUser, onSelectUser }) {
  return (
    <div className="w-1/4 bg-[#1f1f1f] text-white p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>

      <div className="space-y-3">
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
