// NotificationPopup.jsx
import React, { useEffect, useRef } from 'react';
import dayjs from 'dayjs';

export default function NotificationPopup({ notifications, onClose }) {
  const popupRef = useRef();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute right-0 mt-2 w-80 bg-[#2b2b2b] rounded-md shadow-lg p-3 z-50 border border-gray-600"
    >
      <h3 className="text-white text-lg font-semibold mb-2">Notifications</h3>
      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {notifications.length > 0 ? (
          notifications.map((notification, idx) => (
            <div
              key={idx}
              className="p-2 rounded hover:bg-[#3b3b3b] text-white cursor-pointer mb-1"
            >
              <p>{notification.message}</p>
              <span className="text-xs text-gray-400">
                {dayjs(notification.timestamp).format('MMM D, YYYY h:mm A')}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No new notifications</p>
        )}
      </div>
    </div>
  );
}
