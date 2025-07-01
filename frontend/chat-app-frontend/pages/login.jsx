import React, { useState } from 'react';
import { Form, Button, Input, Card, message } from 'antd';
import { login } from '../utils/api';
import PopupMessage from './PopupMessage';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [popupMsg, setPopupMsg] = useState(null);  
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Registering with values:", values);
    try {
      const res = await login(values);
      console.log('Login API response:', res);
      localStorage.setItem('token', res.data.token);
       if (!res.data.token || !res.data.user) {
      return message.error("Invalid server response");
    }
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      setPopupMsg('Login successful!');
      setTimeout(() => {
        navigate('/chat');
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      message.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <Card title="Login" style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label="email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type='primary' htmlType='submit' block>
            Login
          </Button>
        </Form>
      </Card>
      {popupMsg && <PopupMessage message={popupMsg} onClose={() => setPopupMsg(null)} />}
    </>
  );
};

export default Login;
