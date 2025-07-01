const express = require('express')
const {accessChat,fetchChats,createGroupChat} = require("../controllers/chatController");
const router = express.Router()
const {protect} = require('../middleware/authmiddleware');

router.post("/",protect,accessChat);
router.get("/",protect,fetchChats);
router.post("/group",protect,createGroupChat);

module.exports = router;