const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

router.post('/register',async(req,res)=>{
    const {name,email,password} = req.body;
    console.log('Register request body:', req.body);
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save()
        return res.status(201).json({ message: 'User added successfully.' });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }   
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        const userInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
        return res.status(200).json({ token, user: userInfo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }   
});
module.exports = router;