const router = require("express").Router();
const User = require("../models/User").user;
const StatusEnum = require("../models/User").statusEnum;
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    const { password, ...others } = savedUser._doc; 
    res.status(201).json({...others});
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
// You should pass token in request header
router.post('/login', async (req, res) => {
    try{
          const user = await User.findOne(
            {
              username: req.body.username
            }
          );
          
          !user && res.status(401).json("Wrong User Name");
          
          if(user.status != StatusEnum.ACTIVE)
          {
            res.status(402).json("User is not activated");
          }

          const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
          );

          const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

          const inputPassword = req.body.password;

          originalPassword != inputPassword && 
            res.status(400).json("Wrong Password");


          const accessToken = jwt.sign(
          {
              id: user._id,
              isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC,
              {expiresIn:"3d"}
          );

          console.log(user);          
          const { password, ...others } = user._doc;  
          res.status(200).json({...others, accessToken});

    }catch(err){
        res.status(500).json(err);
    }

});

router.get("/logout", async (req, res)=>{
    /* res.clearCookie('jwt');
    res.status(200).json("you loggedOut"); */

    try {
      req.user.tokens = req.user.tokens.filter((token) =>{
       return token.token !== req.token 
      })
      await req.user.save()
      res.send()
    } catch (error) {
        res.status(500).send()
    }
});


module.exports = router;