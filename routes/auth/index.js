const express = require('express');
const User = require('../../app/models/user');
const JWT = require('jsonwebtoken');

const authRoutes = express.Router();

authRoutes.post('/register', (req, res) => {


    const {name, email, password} = req.body;
    
    if(!email || !password) {
        res.json({success: false, message: 'Please enter an email and password'});
    } else {

        const newUser = new User({
            name,
            email,
            password
        });

        // save the new user

        newUser.save((err) => {

            if (err) {

                switch(err.code) {
                    case 11000:
                        return res.json({success: false, message: "User account already exists"});
                    default:
                        return res.json({success: false, message: err});

                }
            }

        const token = JWT.sign({_id: newUser._id}, process.env.JWT_SECRET);

        return res.status(200).json({success: true, token: "Bearer " + token})   
            
        })
    }


});

// Authenticate
authRoutes.post('/login', async (req, res) => {

    try {

        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.send({success: false, message: "Authentication failed. User not found"});
        }


        const isMatch = await user.comparePassword(req.body.password);

        if (!isMatch) {
            return res.send({success: false, message: `AUthentication failed: Password did not match`})
        }

        const token = JWT.sign({_id: user._id}, process.env.JWT_SECRET);


        return res.json({success: true, token: "Bearer " + token})   
    }
    catch(err) {

        return res.status(403).send({success: false, message: err});
    }
})

// authRoutes.get('/dashboard', passport.authenticate('jwt', {session: false}), (req, res) => {

//     res.send(`it worked: User id is ${req.user.email}.`)
// });


module.exports = authRoutes;