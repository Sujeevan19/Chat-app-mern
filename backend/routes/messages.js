const express = require("express")
const {sendMessage,getAllMessages} = require("../controllers/messageController")
const {protect} = require("../middleware/authmiddleware")
const router = express.Router()

router.post("/",protect,sendMessage);
router.get("/:chatId",protect,getAllMessages)


module.exports = router;