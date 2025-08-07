import React, { useEffect, useRef } from 'react';

export default function FriendRequestPopup({ requests, onClose, onAccept, onReject }) {
  const popupRef = useRef();

  // Close popup on outside click
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
      <h3 className="text-white text-lg font-semibold mb-2">Friend Requests</h3>
      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {requests.length > 0 ? (
          requests.map((req, idx) => (
            <div
              key={idx}
              className="p-2 rounded hover:bg-[#3b3b3b] text-white cursor-pointer mb-1"
            >
              <div className="flex justify-between items-center">
                <span>{req.name}</span>
                <div className="space-x-1">
                  <button
                    onClick={() => onAccept(req.id)}
                    className="text-green-400 hover:text-green-300"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onReject(req.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(req.timestamp).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No friend requests</p>
        )}
      </div>
    </div>
  );
}
