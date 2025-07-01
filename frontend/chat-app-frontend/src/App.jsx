import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import { Button, Layout } from 'antd';
import ChatPage from '../pages/chatpage';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Header style={{ display: 'flex', gap: '20px' }}>
          <Button type='link'>
            <Link to="/login">Login</Link>
          </Button>
          <Button type='link'>
            <Link to="/register">Register</Link>
          </Button>
        </Header>
        <Content>
          <Routes>
            <Route path="/" element={<div style={{ padding: 40, textAlign: 'center' }}><h2>Welcome to Chat App</h2></div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
             <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
