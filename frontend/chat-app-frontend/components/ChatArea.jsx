import React from "react";

import { useState } from "react";
const ChatArea = ({ chat, messages, onSendMessage }) => {
  const [msg, setMsg] = useState("");
  const handleSend = () => {
    if (!msg.trim()) return;
    onSendMessage(msg);
    setMsg("");
  };

  return (
    <div className="chat-area">
      <div className="messages">
        {messages.map((m, idx) => (
  
          <div key={idx}>
            <strong>{m.sender.name || 'Unknown'}:</strong> {m.content}
          </div>
))}
      </div>
      <div className="message-input">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
export default ChatArea;