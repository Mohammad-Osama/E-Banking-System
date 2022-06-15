const User = require("../models/User");
const Token = require("../models/Token");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `Use this link to reset your password: ${process.env.BASE_URL}/reset-password/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);

        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

router.post("/:userId/:token", async (req, res) => {
    try {
        //console.log(`new pass: ${req.body.password}`);
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");
        

        let newPass;
        if (req.body.password) {
            
            newPass = CryptoJS.AES.encrypt(
              req.body.password,
              process.env.SECRET_KEY
            ).toString();
        }
        user.password = newPass;
        await user.save();
        await token.delete();

        res.send("password reset sucessfully.");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

module.exports = router;