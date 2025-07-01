import React from 'react';


const Sidebar = ({ chats = [], searchResults = [], onSelectChat, accessChat }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="sidebar">
      {searchResults.length > 0 ? (
        <>
          <div className="sidebar-header">Search Results</div>
          {searchResults.map((user) => (
            <div key={user._id} className="chat-item" onClick={() => accessChat(user._id)}  style={{
          padding: "10px",
          margin: "5px 0",
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
          cursor: "pointer",
        }}>
              {user.name}
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="sidebar-header">My Chats</div>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat._id}
                className="chat-item"
                onClick={() => onSelectChat(chat)}
              >
                {chat.isGroupChat
                  ? chat.chatName
                  : chat.users.find((u) => u._id !== currentUser?._id)?.name || "Unnamed"}
              </div>
            ))
          ) : (
            <p>No chats available</p>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
