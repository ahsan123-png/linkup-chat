import React, { useState, useRef, useEffect } from 'react';

// Props:
// - `user`: string – the current user's name
// - `messages`: array – all messages to display
// - `onSend`: function – handles sending a message
// - `members`: array – group or chat members
// - `profilePic`: string – the URL of the selected user's profile picture (NEW PROP)
export default function ChatWindow({ user, messages = [], onSend, members = [], profilePic }) { // Add profilePic to destructuring 
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const sendMessage = () => {
    if (input.trim() === '' && !file) return;

    const message = {
      sender: 'You',
      text: input.trim(),
      file: file ? previewUrl : null,
      fileType: file?.type || null,
    };

    onSend(message);
    setInput('');
    setFile(null);
    setPreviewUrl('');
  };

  return (
    <div className="flex flex-col flex-1 bg-[url('./img/whatsapp-bg.png')] bg-cover bg-center">

      {/* 👤 Header: displays current user, profile picture, and members */}
      <div className="bg-[#333333] shadow p-4 flex items-center justify-between border-b border-[#4CAF50]">
        <div className="flex items-center"> {/* Added flex container for profile pic and text */}
          {profilePic && (
            <img
              src={profilePic}
              alt={`${user}'s profile`}
              className="w-10 h-10 rounded-full mr-3 object-cover" // Styling for profile picture
            />
          )}
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg text-white">{user}</h3>
            {members.length > 0 && (
              <span className="text-sm text-gray-100">
                Members: {members.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 💬 Messages Area */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse p-4 space-y-4 space-y-reverse">
        {/* Render messages in reverse order */}
        {[...messages].reverse().map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl shadow max-w-sm ${
              msg.sender === 'You'
                ? 'bg-[#4CAF50] text-white ml-auto'
                : 'bg-[#332233] text-white mr-auto'
            }`}
          >
            <p><strong>{msg.sender}:</strong> {msg.text}</p>
            {msg.file && msg.fileType?.startsWith('image') && (
              <img src={msg.file} alt="media" className="mt-2 rounded-lg max-h-48" />
            )}
            {msg.file && msg.fileType?.startsWith('video') && (
              <video src={msg.file} controls className="mt-2 rounded-lg max-h-48" />
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 📝 Input Section */}
      <div className="p-4 bg-[#333333] flex flex-col gap-2">

        {/* 📸 Preview of selected media */}
        {previewUrl && (
          <div className="relative w-fit">
            {file.type.startsWith('image') ? (
              <img src={previewUrl} alt="preview" className="max-h-40 rounded-lg" />
            ) : (
              <video src={previewUrl} className="max-h-40 rounded-lg" controls />
            )}
            <button
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 text-xs"
              onClick={() => {
                setFile(null);
                setPreviewUrl('');
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ✍️ Message Input + 📁 File Upload */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#4CAF50] file:text-white hover:file:bg-[#45a049] cursor-pointer"
          />
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-[#4CAF50] rounded-xl px-4 py-2 outline-none text-white bg-[#1a1a1a] placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-[#4CAF50] text-white px-4 py-2 rounded-xl hover:bg-[#45a049] transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}