require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require('../models/user')
const bcrypt = require('bcrypt')
const {isAuth} = require('../controller/auth-user')

router.post('/signup', async (req,res) => {
    try {
    const hashed_password = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
          userName: req.body.userName,
          givenName: req.body.firstName,
          email:req.body.email,
          phone: req.body.phone,
          hashed_password: hashed_password,
    })
    console.log(newUser)
        const addedUser = await newUser.save()
        res.status(201).json({message: "Sign Up Successful" })
    } catch (err) {
        console.log(err.message)
        res.status(400).json({message: err.message })
    }
})

router.post('/logout', isAuth,   async (req, res) => {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: 'Authorization fail!' });
      }
    //   console.log(req.user)
      const tokens = req.user.tokens;
  
      const newTokens = tokens.filter(t => t.token !== token);
  
      await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
      res.json({ success: true, message: 'Sign out successfully!' });
    }
  })

router.post('/login', async (req,res) => {
    try {
        console.log(req.body)
    const {userName,password} = req.body
    const user = await User.findOne({userName})
    if(!user){
        return res.status(400).send("Cannot Find User")
    }

        if(await bcrypt.compare(password, user.hashed_password)){
            const payload ={
                _id: user._id,
                givenName: user.givenName,
                email: user.email
            }
            const accessToken = generateAccessToken(payload)
            const refreshToken = jwt.sign(payload,process.env.JWT_TOKEN_SECRET, {expiresIn: '24h'})
            
            let oldtokens = user.tokens || []
            if(oldtokens.length){
                oldtokens = oldtokens.filter(t => {
                    const timeDif = (Date.now() - parseInt(t.signedAt)) / 1000
                    if(timeDif < 86400){
                        return t
                    }
                })
            }
            await User.findByIdAndUpdate(user._id, {tokens: [...oldtokens,  {token: refreshToken, signedAt: Date.now().toString() }]})
            
            res.json({accessToken: accessToken, refreshToken: refreshToken})

        }
        else{
            res.send("Not Allowed")
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

function generateAccessToken(payload){
    return jwt.sign(payload,process.env.JWT_TOKEN_SECRET, {expiresIn: '1h'})
}

module.exports = router