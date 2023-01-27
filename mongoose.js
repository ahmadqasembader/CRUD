/****************************************/
        /* DATABASE CONNECTION */
/****************************************/
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/crud-application-nodejs")
.then(() => console.log("Database connected!"))
.catch(err => console.log("MongoDB Errors are the following " + err));

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'username is taken'],
        lowercase: true,
        maxLength: [20, 'Too many characters, max is 20']
    },
    name: {
        type: String,
        required: [true, 'Please enter name'],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minLength: [5, 'at least 5 characters'],
        maxLength: [20, 'Too many characters, max is 20']
    }
})

module.exports = mongoose.model("User", userSchema);
