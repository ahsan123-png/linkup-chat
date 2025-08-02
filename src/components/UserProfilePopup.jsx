import React, { useState, useRef, useEffect } from 'react';

const UserProfilePopup = ({ isOpen, onClose, currentUser, onSave, onGoToSettings }) => {
  if (!isOpen) return null;

  const fileInputRef = useRef(null);

  // 🌟 UseEffect to set initial state from currentUser once
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null); // Track selected file separately

  useEffect(() => {
    setName(currentUser?.full_name || currentUser?.name || '');
    setStatus(currentUser?.status || '');
    setAvatarPreview(
      currentUser?.profile_image
        ? currentUser.profile_image.includes('http')
          ? currentUser.profile_image
          : `http://127.0.0.1:8000${currentUser.profile_image}`
        : '/img/default-avatar.jpg'
    );
  }, [currentUser]);

  // 📸 Image Preview + File Tracking
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 📤 Submit updated profile
  const handleSave = async () => {
    const accessToken = localStorage.getItem('accessToken');
    console.error("Access Token:", accessToken);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId || !accessToken) {
      console.error("User not logged in or missing access token.");
      alert("Authentication error. Please log in again.");
      return;
    }

    const formData = new FormData();
    if (name) formData.append("full_name", name);
    if (status) formData.append("status", status);
    if (avatarFile) formData.append("profile_image", avatarFile);

    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        alert("Failed to update profile.");
        return;
      }

      const updatedUser = await response.json();

      const updatedWithImage = {
        ...updatedUser,
        profile_image: updatedUser.profile_image
          ? `http://127.0.0.1:8000${updatedUser.profile_image}?t=${Date.now()}`
          : null,
      };

      localStorage.setItem('user', JSON.stringify(updatedWithImage));
      onSave(updatedWithImage);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong while updating the profile.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] rounded-xl shadow-lg w-96 p-6 text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center mb-6">
          {/* Avatar */}
          <div className="relative mb-4">
            <img
              src={avatarPreview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#4CAF50]"
              onError={(e) => { e.target.src = '/img/default-avatar.jpg'; }}
            />
            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-[#4CAF50] text-white rounded-full p-1 hover:bg-[#45a049] transition"
              aria-label="Change profile picture"
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

          {/* Name */}
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

          {/* Status */}
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

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSave}
            className="w-full py-2 bg-[#4CAF50] text-white font-semibold rounded hover:bg-[#45a049] transition"
          >
            Save
          </button>
          <button
            onClick={onGoToSettings}
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
