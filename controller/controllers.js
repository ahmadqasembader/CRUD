const User = require('../mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// find all users
function findAllEntries(req, res) {

    //Sending all data entry as a json
    let entry;
    User.find((err, data) => {
        if (data.length === 0) {
            res.send("No data was found")
        } else {
            entry = data
            res.send(entry)
        }
    })

}

//find users by their username
function findByUsername(req, res) {
    let username = req.params.username;

    User.find(
        { "username": username },
        (_, data) => {
            res.status(200).send(data)
        }
    )
}

//create a new user and save it to DB
async function createUser(req, res) {
    let { username, name, email, password } = req.body;

    //hashing the password
    const passwordHashed = await bcrypt.hash(password, 10);

    //default the email to the username + @gunsel.com.tr if no email was entered
    if (req.body.email == null || req.body.email == '') {
        email = `${username}@gunsel.com.tr`
    }

    //create a new user model and save to the DB
    const user = new User({ username, name, email, passwordHashed });

    //Generate JWT token for each created user
    let token = jwt.sign({ user }, "token", )
    user.token = token;

    await user.save().then((user) => {
        console.log("Datasaved");
        res.status(200).json({ username: user.username, email: email, password: passwordHashed, token: user.token })
    }).catch((err) => console.log(err.message))
}

// Edit user details
function editUser(req, res) {
    let {username, name, email} = req.body;
    let id = req.params.id;
    User.findByIdAndUpdate(id, req.body, { new: true })
        .catch(err => console.log(err));
    res.status(200).send(id);
}


function resestPassword(req, res) {
    let {password} = req.body
    let id = req.params.id;

    User.findByIdAndUpdate(id, password, {new: true})
        .then(() => res.status(200).send("Password was reset successfully!"))
        .catch(err => console.log(err))
    
}


// Deleting users from database
function removeUser(req, res) {
    id = req.params.id;

    User.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(200).send("Not found")
            }
        })
        .catch(err => console.log(err))
    res.status(200).send("User Has Been Removed");
}


async function login(req, res) {
    const {email, passwordHashed} = req.body;

    //validate if the user does exist
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(passwordHashed, user.passwordHashed))){
        const token = jwt.sign({user});
        user.token = token;
    }

    res.status(200).send(user);
}


module.exports = {
    findAllEntries,
    findByUsername,
    createUser,
    editUser,
    removeUser,
    resestPassword,
    login
}