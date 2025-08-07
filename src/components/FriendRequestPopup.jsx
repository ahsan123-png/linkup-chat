import React, { useEffect, useRef } from 'react';
import dayjs from 'dayjs';

export default function FriendRequestPopup({ requests, onClose, onConfirm, onReject }) {
  const popupRef = useRef();

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
      className="absolute right-0 mt-2 w-96 bg-[#2b2b2b] rounded-md shadow-lg p-3 z-50 border border-gray-600"
    >
      <h3 className="text-white text-lg font-semibold mb-2">Friend Requests</h3>
      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
        {requests.length > 0 ? (
          requests.map((req, idx) => (
            <div
              key={idx}
              className="p-2 rounded hover:bg-[#3b3b3b] text-white mb-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p>{req.name}</p>
                  <span className="text-xs text-gray-400">
                    {req.timestamp
                      ? dayjs(req.timestamp).format('MMM D, YYYY h:mm A')
                      : 'Unknown time'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onConfirm(req)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => onReject(req)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No new friend requests</p>
        )}
      </div>
    </div>
  );
}
