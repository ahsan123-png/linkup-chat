// CreateGroupPopup.jsx
import React, { useState, useRef } from 'react';

const CreateGroupPopup = ({ isOpen, onClose, availableUsers, onCreateGroup }) => {
  // Don't render if not open
  if (!isOpen) return null;

  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupAvatar, setGroupAvatar] = useState('');
  const fileInputRef = useRef(null);

  const toggleUserSelection = (userName) => {
    setSelectedUsers(prev =>
      prev.includes(userName)
        ? prev.filter(name => name !== userName)
        : [...prev, userName]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name.');
      return;
    }
    if (selectedUsers.length === 0) {
      alert('Please select at least one member.');
      return;
    }
    // Pass group data to parent handler
    onCreateGroup({
      name: groupName.trim(),
      members: selectedUsers,
      avatar: groupAvatar || '/img/default-group-avatar.jpg'
    });
    // Reset form and close
    setGroupName('');
    setSelectedUsers([]);
    setGroupAvatar('');
    onClose();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] rounded-xl shadow-lg w-96 p-6 text-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Group</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <img
              src={groupAvatar || '/img/default-group-avatar.jpg'}
              alt="Group Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#4CAF50]"
              onError={(e) => { e.target.src = '/img/default-group-avatar.jpg'; }}
            />
            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-[#4CAF50] text-white rounded-full p-1 hover:bg-[#45a049] transition"
              aria-label="Change group picture"
            >
              <i className="fas fa-camera"></i>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
              aria-hidden="true"
            />
          </div>

          <div className="w-full mb-4">
            <label htmlFor="groupName" className="block text-sm font-medium mb-1">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full p-2 rounded bg-[#1f1f1f] border border-gray-600 focus:border-[#4CAF50] focus:outline-none text-white"
            />
          </div>
        </div>

        <div className="w-full mb-6">
          <label className="block text-sm font-medium mb-2">
            Add Members ({selectedUsers.length} selected)
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-600 rounded bg-[#1f1f1f]">
            {/* Filter out 'You' or any logic for the current user if needed */}
            {availableUsers?.filter(u => u !== 'You').map((user) => (
              <div
                key={user}
                className={`flex items-center p-2 cursor-pointer hover:bg-[#3a3a3a] ${
                  selectedUsers.includes(user) ? 'bg-[#4CAF50] bg-opacity-20' : ''
                }`}
                onClick={() => toggleUserSelection(user)}
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user)}`}
                  alt={user}
                  className="w-8 h-8 rounded-full mr-2"
                  onError={(e) => { e.target.src = '/img/default-avatar.jpg'; }}
                />
                <span className="text-white flex-1">{user}</span>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user)}
                  onChange={() => {}} // Handled by parent div onClick
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCreate}
            className="w-full py-2 bg-[#4CAF50] text-white font-semibold rounded hover:bg-[#45a049] transition"
          >
            Create Group
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 bg-[#1f1f1f] text-white font-semibold rounded border border-gray-600 hover:bg-[#2d2d2d] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPopup;