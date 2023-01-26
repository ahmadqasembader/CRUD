/****************************************/
        /* DATABASE CONNECTION */
/****************************************/
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/crud-application-nodejs")
.then(() => console.log("Database connected!"))
.catch(err => console.log("MongoDB Errors are the following " + err));

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
    username: String,
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: String
})

module.exports = mongoose.model("User", userSchema);
