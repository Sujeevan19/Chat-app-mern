const Message = require("../models/message");
const Chat = require("../models/chat");

exports.sendMessage = async(req,res)=>{
    const {content,chatId} = req.body;
    if (!content ||!chatId) {
        return res.status(400).send("Missing content or chatId");
    }
    const newMessage = {
        sender:req.user._id,
        content,
        chat:chatId,
    };
    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender","name email");
        message = await message.populate("chat");
        message = await message.populate({
            path:"chat.users",
            select:"name email",
        });

        await Chat.findByIdAndUpdate(chatId,{latestMessage:message});
        res.status(201).json(message);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAllMessages = async(req,res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId}).populate("sender","name email").populate("chat");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).send(error.message);
    }
};