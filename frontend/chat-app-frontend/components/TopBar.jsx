import React from "react";
import { Input, Button } from "antd";
import { useState } from "react";

const TopBar = ({ onLogout, onSearch }) => {
  const [query, setQuery] = useState(''); // Add local state for input value

  const handleSearch = (value) => {
    console.log('Search triggered with value:', value); // Debug
    onSearch(value); // Pass the value to the parent
  };

  return (
    <div className="top-bar">
      <Input.Search
        placeholder="Search users..."
        style={{ width: 200 }}
        value={query} // Controlled input
        onChange={(e) => setQuery(e.target.value)} // Update state on change
        onSearch={handleSearch} // Triggered on Enter or search icon click
        allowClear
      />
      <div className="controls">
        <Button onClick={() => window.alert("Minimize not implemented")}>_</Button>
        <Button onClick={() => window.alert("Maximize not implemented")}>⛶</Button>
        <Button danger onClick={onLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default TopBar;