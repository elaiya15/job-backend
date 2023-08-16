const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const keysecret = process.env.SECRET_KEY


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
            
      
       
    },
    number: {
        type: String,
        required: true
    },
});





// hash password

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next()
});


// createing model
const userdb = new mongoose.model("users", userSchema);

module.exports = userdb;


// if (this.isModified("password")) {    }