const Chat = require("../models/chat");
const User = require("../models/user");

exports.accessChat = async  (req,res)=>{
    const {userId} = req.body
    if (!userId) return res.status(400).send("userId Param is not valid")
    let chat = await Chat.findOne({
        isGroupChat:false,
        users:{$all: [req.user._id,userId]},
    }).populate("users","-password").populate("latestMessage");

    if (chat) return res.send(chat);
    try {
        const newChat = await Chat.create({
            isGroupChat:false,
            users:[req.user._id,userId],
        })
        const fullChat = await Chat.findById(newChat._id).populate("users","-password");
        res.status(200).json(fullChat);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: { $in: [req.user._id] } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).send(chats);
  } catch (err) {
    res.status(500).send(err.message);
  }
};   
exports.createGroupChat = async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).send("All fields required");
  }

  if (users.length < 2) {
    return res.status(400).send("Group must contain at least 3 members including you");
  }

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: [...users, req.user._id],
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroup = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroup);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
