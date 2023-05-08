const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.isAuth = async (req,res,next) => {
        let userid = undefined
        console.log((req.headers['authorization']));
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null) return res.sendStatus(401)
        jwt.verify(token,process.env.JWT_TOKEN_SECRET, async (err,payload) => {
            if(payload != null){
                userid = payload._id
            }
            else {
                return res.sendStatus(500)
            }
        })
        const user = await User.findById(userid)
        if (user == null) {
            return res.status(404).json({message: 'Cannot find'})
        }
        req.user = user
    
    next()
}