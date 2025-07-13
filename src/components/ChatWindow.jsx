import React, { useState } from 'react';

// Props used: `user`, `messages`, `onSend`, `members`
export default function ChatWindow({ user, messages = [], onSend, members = [] }) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // 🔄 Handles file selection and generates preview URL
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  // ✉️ Constructs the message object and calls the `onSend` prop
  const sendMessage = () => {
    if (input.trim() === '' && !file) return;

    const message = {
      sender: 'You',                // Static value for now
      text: input.trim(),          // User input text
      file: file ? previewUrl : null,  // Preview URL for image/video
      fileType: file?.type || null,    // File MIME type (e.g., image/jpeg)
    };

    onSend(message); // 🔧 Prop function passed from parent, triggers message send logic
    setInput('');
    setFile(null);
    setPreviewUrl('');
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100">
      {/* 👤 Header displaying the current user's name and group members */}
      <div className="bg-white shadow p-4 border-b">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{user}</h3> {/* 🧠 `user` prop shown here */}
          {members.length > 0 && (
            <span className="text-sm text-gray-500">
              Members: {members.join(', ')} {/* 👥 `members` prop used to list names */}
            </span>
          )}
        </div>
      </div>

      {/* 💬 Message list displayed from the `messages` prop */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (   // 📦 `messages` prop iterated to render chat bubbles
          <div
            key={index}
            className={`p-3 rounded-xl shadow max-w-sm ${
              msg.sender === 'You'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-white text-black'
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
      </div>

      {/* 📝 Input section with file preview and message field */}
      <div className="p-4 bg-white border-t flex flex-col gap-2">
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

        {/* 🧾 Text and file inputs for message creation */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="text-sm"
          />
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // ⌨️ Enter sends message
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}