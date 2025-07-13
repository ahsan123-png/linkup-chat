import React from 'react';

export default function Sidebar() {
  return (
    <div className="w-1/4 bg-[#1f1f1f] text-white p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>

      <div className="space-y-3">
        <div className="p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] cursor-pointer">
          John Doe
        </div>
        <div className="p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] cursor-pointer">
          Group Chat #1
        </div>
      </div>
    </div>
  );
}
