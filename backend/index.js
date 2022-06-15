require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const cors = require("cors");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const resetPass = require("./routes/reset-password");



// connect to DB
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected"))
    .catch((err) => {
        console.log(err);
    });


// Routes
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/reset-password", resetPass);




app.listen(process.env.SERVER_PORT || 8888, ()=>{
    console.log("server is running!!");
});


