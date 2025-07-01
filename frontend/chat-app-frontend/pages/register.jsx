import React,{useState} from 'react';
import {Form,Button,Input,Card,message} from 'antd';
import {register} from '../utils/api';
import PopupMessage from './PopupMessage';

const Register = () => {
   const [popupMsg, setPopupMsg] = useState(null);
  const onFinish = async (values) => {
    console.log("Registering with values:", values);
    try {
      await register(values);
      setPopupMsg('Registration successful!');
    } catch (err) {
      message.error(err.response?.data?.message || 'Registration failed');
    }
  };

return (
  <>
    <Card title="Register" style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Register
        </Button>
      </Form>
    </Card>
    {popupMsg && <PopupMessage message={popupMsg} onClose={() => setPopupMsg(null)} />}
    </>
  );
};

export default Register;