const UserModel = require("../models/users");
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require("../../config.json");
const auth = require("../../middleware/auth");

// Login
router.post("/auth/login", (req, res) => {
    const {email, password} =  req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    UserModel.findOne({ email }).then(user => {
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        // Validate password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch)
                return res.status(400).json({ msg: 'Password does not match' });
            jwt.sign(
                { id: user.id },
                config['jwtSecret'],
                { expiresIn: 7200 },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            fullName: user.fullName,
                            email: user.email
                        }
                    });
                }
            );
        });
    });
});


// Register
router.post("/auth/register", (req, res) => {
    const { fullName, email, password} = req.body;

    if (!fullName || !email || !password) {
        console.log("validation")
        return res.status(400).json({ msg: 'Please enter all fields' });
    };

    UserModel.findOne({ email }).then(user => {
        console.log("mongoose")
        if (user)
            return res
                .status(400)
                .json({ msg: 'This email address is already used' });

        const newUser = new UserModel({
            fullName,
            email,
            password
        });

        // Encrypt password before storage
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                return res.json({"success": true, "message":"Successfully Registered. Please login!"})
            });
        });
    });
});

// Get current user info

router.get('/auth/user', auth, (req, res) => {
    UserModel.findById(req.user.id).select('-password').then(user => res.json(user))
})

//  GET USER BY ID
router.get('/user/:id', (req, res) => {
    UserModel.findById({ _id: req.params.id }, (err, properties) => {
        if (err) {
            res.send('Something is wrong');
        }
        res.json(properties);
    });
});


module.exports = router;