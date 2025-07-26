// UserProfilePopup.jsx
import React, { useState, useRef } from 'react';

const UserProfilePopup = ({ isOpen, onClose, currentUser, onSave, onGoToSettings }) => {
  // Don't render if not open
  if (!isOpen) return null;

  // Local state for form fields
  const [name, setName] = useState(currentUser?.name || '');
  const [status, setStatus] = useState(currentUser?.status || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const fileInputRef = useRef(null);

  // Handle saving the updated profile
  const handleSave = () => {
    // Basic validation can be added here if needed
    onSave({ name, status, avatar }); // Pass updated data to parent
    onClose(); // Close the popup after saving
  };

  // Handle file selection for avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd likely upload the file and get a URL back.
      // For demo purposes, we'll use a local object URL.
      // Note: This URL is temporary and will be lost on page refresh.
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Set the base64 data URL as the avatar
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger the hidden file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] rounded-xl shadow-lg w-96 p-6 text-white">
        {/* Popup Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            &times; {/* Close 'X' button */}
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center mb-6">
          {/* Avatar Display & Upload */}
          <div className="relative mb-4">
            <img
              src={avatar || '/img/default-avatar.jpg'} // Display selected avatar or default
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#4CAF50]"
              onError={(e) => { e.target.src = '/img/default-avatar.jpg'; }} // Fallback
            />
            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-[#4CAF50] text-white rounded-full p-1 hover:bg-[#45a049] transition"
              aria-label="Change profile picture"
            >
              <i className="fas fa-camera"></i> {/* Requires Font Awesome */}
              {/* Or use text if icons aren't loaded: <span className="text-xs">Edit</span> */}
            </button>
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
              aria-hidden="true"
            />
          </div>

          {/* Name Input */}
          <div className="w-full mb-4">
            <label htmlFor="userName" className="block text-sm font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-[#1f1f1f] border border-gray-600 focus:border-[#4CAF50] focus:outline-none"
            />
          </div>

          {/* Status Input */}
          <div className="w-full">
            <label htmlFor="userStatus" className="block text-sm font-medium mb-1">
              Status
            </label>
            <input
              type="text"
              id="userStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Hey there! I am using this app."
              className="w-full p-2 rounded bg-[#1f1f1f] border border-gray-600 focus:border-[#4CAF50] focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSave}
            className="w-full py-2 bg-[#4CAF50] text-white font-semibold rounded hover:bg-[#45a049] transition"
          >
            Save
          </button>
          <button
            onClick={onGoToSettings} // This function needs to be defined in the parent (Sidebar)
            className="w-full py-2 bg-[#1f1f1f] text-white font-semibold rounded border border-gray-600 hover:bg-[#2d2d2d] transition"
          >
            Go to Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePopup;