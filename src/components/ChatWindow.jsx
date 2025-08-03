import React, { useState, useEffect, useRef } from 'react';

export default function ChatWindow({ user, members = [] }) {
  const [input, setInput] = useState('');
  const [chatMap, setChatMap] = useState({});
  const [socket, setSocket] = useState(null);
  const [file, setFile] = useState(null);
  const chatEndRef = useRef(null);

  const API_BASE = "http://127.0.0.1:8000/users/api/chat";
  const WS_BASE = "ws://127.0.0.1:8000/ws/chat";
  const token = localStorage.getItem("accessToken");
  const currentUsername = user?.username;

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/history/${currentUsername}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setChatMap(prev => ({
            ...prev,
            [currentUsername]: data,
          }));
          scrollToBottom();
        }
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };

    if (currentUsername) fetchHistory();
  }, [currentUsername]);

  useEffect(() => {
    if (!currentUsername || !token) return;

    const ws = new WebSocket(`${WS_BASE}/${currentUsername}/?token=${token}`);

    ws.onopen = () => console.log(`🟢 WebSocket connected`);
    ws.onclose = () => console.log(`🔴 WebSocket disconnected`);
    ws.onerror = (err) => console.error("❌ WebSocket error:", err);

    ws.onmessage = (event) => {
      const { message, sender } = JSON.parse(event.data);

      setChatMap(prev => {
        const newMsg = {
          content: message,
          sender,
          sent_at: new Date().toISOString(),
        };
        const existing = prev[currentUsername] || [];
        return {
          ...prev,
          [currentUsername]: [...existing, newMsg],
        };
      });

      scrollToBottom();
    };

    setSocket(ws);
    return () => ws.close();
  }, [currentUsername, token]);

  const handleSend = async () => {
  if (!input.trim() && !file) return;

  const formData = new FormData();
  formData.append("receiver_username", currentUsername);
  if (input.trim()) formData.append("content", input.trim());
  if (file) formData.append("file", file);

  try {
    const res = await fetch(`${API_BASE}/send/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to send message");
    const { data } = await res.json();

    // 🔁 Only append if file is included, since WebSocket doesn't handle files
    if (file) {
      setChatMap(prev => {
        const existing = prev[currentUsername] || [];
        return {
          ...prev,
          [currentUsername]: [...existing, data],
        };
      });
    }

    // ✅ Only send text via WebSocket (no need to push to state)
    if (input.trim() && socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message: input.trim() }));
    }

  } catch (err) {
    console.error("API send failed:", err);
  }

  setInput('');
  setFile(null);
  scrollToBottom();
};


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  const currentChat = chatMap[currentUsername] || [];

  return (
    <div className="flex flex-col flex-1 bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="p-4 bg-[#333] flex justify-between items-center border-b border-green-500">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full"
            onError={(e) => { e.target.src = "/img/avatar.png"; }}
          />
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            {members.length > 0 && (
              <p className="text-sm text-gray-400">
                Members: {members.map(m => m.name).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentChat.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs px-4 py-2 rounded-xl shadow text-sm ${
              msg.sender === user.username ? 'bg-gray-700 mr-auto' : 'bg-green-600 ml-auto'
            }`}
          >
            <p><strong>{msg.sender === user.username ? user.name : 'You'}:</strong> {msg.content}</p>

            {/* Render file (if exists) */}
            {msg.file_url && (
              msg.file_url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <img src={msg.file_url} alt="attachment" className="mt-2 max-w-full rounded-md" />
              ) : msg.file_url.match(/\.(mp4|webm|ogg)$/i) ? (
                <video controls src={msg.file_url} className="mt-2 max-w-full rounded-md" />
              ) : (
                <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-400 underline">View Attachment</a>
              )
            )}

            <p className="text-xs mt-1 text-gray-300 text-right">
              {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 bg-[#2c2c2c] flex items-center gap-2 border-t border-green-500">
        {/* 📎 File */}
        <label className="cursor-pointer bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md">
          📎
          <input type="file" hidden onChange={handleFileChange} />
        </label>

        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 bg-black text-white rounded-lg border border-green-500 outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
