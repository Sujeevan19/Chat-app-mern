import React , {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import ChatArea from '../components/ChatArea';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import { socket } from "../src/socket";

const ChatPage = ()=>{
    const navigate = useNavigate();
    const [selectedChat,setSelectedChat] = useState(null);
    const [chats,setChats] = useState([]);
    const [messages,setMessages] = useState([]);
    const [user,setUser] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user"); 
        if(!token || !storedUser) return navigate("/");
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        socket.connect();
        socket.emit("setup", parsedUser);
        console.log('Fetching chats from /api/chat');
        axios.get("/api/chat",{
            headers:{Authorization:`Bearer ${token}`},
        }).then((res)=>{setChats(res.data)
                console.log('chat API response:',res.data)})
        .catch((err)=>console.error('Chat fetch failed:',err));


        return () => socket.disconnect();
    },[]);
    

  useEffect(() => {
    if (selectedChat) {
      axios
        .get(`/api/message/${selectedChat._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setMessages(res.data);
          socket.emit("join chat", selectedChat._id);
        });

      socket.on("message received", (newMessage) => {
        if (newMessage.chat._id === selectedChat._id) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    }
  }, [selectedChat]);


const handleSend = async (msgContent) => {
  if (!selectedChat || !selectedChat._id || typeof selectedChat._id !== 'string') {
    console.error('Invalid chat selected:', selectedChat);
    return;
  }
  console.log('Sending message with payload:', { content: msgContent, chatId: selectedChat._id });
  try {
    const { data } = await axios.post(
      "/api/message",
      { content: msgContent, chatId: selectedChat._id },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setMessages([...messages, data]);
    socket.emit("new message", data);
  } catch (err) {
    console.error('Message send failed:', err.response ? err.response.data : err.message);
  }
};
///const handleSearch = async (query) => {
//  if (!query) return;
  //try {
    //const token = localStorage.getItem("token");
    //const { data } = await axios.get(`/api/user?search=${query}`, {
     // headers: { Authorization: `Bearer ${token}` },
    //});
    //setSearchResults(data);
  //} catch (err) {
   // console.error("Search failed:", err);
 // }
//};
  const handleSearch = async (query) => {
  if (!query) return;
  console.log('ChatPage handleSearch triggered with query:', query);
  try {
    const token = localStorage.getItem("token");
    console.log('Token used:', token);
    const { data } = await axios.get(`/api/user?search=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Search API response:', data);
    setSearchResults(data);
  } catch (err) {
    console.error('Search failed:', err);
  }
};
const accessChat = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.post(
        '/api/chat',
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setSearchResults([]);
    } catch (err) {
      console.error('Access chat failed:', err);
    }
  };

useEffect(() => {
  console.log('Updated searchResults:', searchResults);
}, [searchResults]);

  return (
    <div className="chat-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar onLogout={() => { localStorage.clear(); navigate("/"); }} onSearch = {handleSearch}/>
      <div className="chat-body" style={{ flex: 1, display: 'flex' }}>
        <Sidebar chats={chats} onSelectChat={setSelectedChat} searchResults={searchResults} accessChat={accessChat}/>
        {selectedChat && (
          <ChatArea
            chat={selectedChat}
            messages={messages}
            onSendMessage={handleSend}
          />
        )}
      </div>
    </div>
  );
}
export default ChatPage;