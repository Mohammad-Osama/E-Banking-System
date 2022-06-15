const mongoose = require("mongoose");
const StatusEnum = Object.freeze({"ACTIVE":"ACTIVE",
                                  "SUSPENDED":"SUSPENDED",
                                  "PENDING":"PENDING",});

const UserSchema = new mongoose.Schema(
  {
    username: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: { type: String, default: StatusEnum.PENDING },
  },
  { timestamps: true }
);


var crypto = require('crypto');



UserSchema.methods.setPassword = function(password) { 
     
    // Creating a unique salt for a particular user 
       this.salt = crypto.randomBytes(16).toString('hex'); 
     
       // Hashing user's salt and password with 1000 iterations, 
        
       this.hash = crypto.pbkdf2Sync(password, this.salt,  
       1000, 64, `sha512`).toString(`hex`); 
   }; 
     
   // Method to check the entered password is correct or not 
   UserSchema.methods.validPassword = function(password) { 
       var hash = crypto.pbkdf2Sync(password,  
       this.salt, 1000, 64, `sha512`).toString(`hex`); 
       return this.hash === hash; 
   }; 

module.exports = {user:mongoose.model("User", UserSchema), statusEnum: StatusEnum};
// module.exports = {order:mongoose.model("Order", OrderSchema), statusEnum: StatusEnum};