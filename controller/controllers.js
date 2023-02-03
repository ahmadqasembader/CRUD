const bcrypt = require('bcrypt');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const User = require('../mongoose');
require('dotenv').config();

const config = process.env
class Users_Operation {
    constructor(mes) {
        console.log("Message: " + mes)
    }

    signedIn(req, res) {
        res.json(req.user)
    }
    
    async login(req, res) 
    {
        const { email, password } = req.body;
        try {
            //validate if the user does exist
            const user = await User.findOne({ email })

            //assign the JWT to the user
            if (user && (await bcrypt.compare(password, user.passwordHashed))) {
                const token = jwt.sign({user}, config.TOKEN_KEY)
                //res.status(200).send({user, token});
            }
            
        } catch (error) {
            res.send(error)
        }
    }

    // Returns all users
    findAllEntries(req, res) {
        
        res.render('index')
        // User.find((err, data) => {
        //     if (data.length === 0)
        //         res.json(
        //             {
        //                 message: "No data was found"
        //             })
        //     else
        //         res.send(data)
        // })
    }

    // Return a specific user based on the username (unique)
    findByUserName(req, res) {
        let username = req.params.username;

        User.find(
            { "username": username },
            (_, data) => { res.status(200).send(data) }
        )
    }

    //create a new user and save it to DB
    async createUser(req, res) {
        let { username, name, email, password } = req.body;

        //hashing the password
        const passwordHashed = await bcrypt.hash(password, 10);

        //default the email to the username + @gunsel.com.tr if no email was entered
        if (req.body.email == null || req.body.email == '')
            email = `${username}@gunsel.com.tr`

        try {
            //create a new user model and save to the DB
            const user = new User({ username, name, email, passwordHashed })

            //Generate JWT token for each created user
            let token = jwt.sign({ user }, "token",)
            user.token = token;

            //saving the user into the database
            user.save((user) => {
                console.log("Datasaved");
                res.status(200).json(
                    {
                        username,
                        email,
                        token
                    }
                );
            })

        } catch (err) {
            console.log('err ' + err);
            res.status(500).send(Error);
        }
    }

    // Edit user details
    editUser(req, res) {
        let id = req.params.id;
        User.findByIdAndUpdate(id, req.body, { new: true }, () => {
            res.status(200).send(id);
        })

    }

    // Deleting users from database
    removeUser(req, res) {
        const id = req.params.id;

        User.findByIdAndDelete(id, () => {
            res.status(200).send("User Has Been Removed");
        })
    }

}

module.exports = Users_Operation;