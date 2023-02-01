const User = require('../mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

class Users_Operation 
{
    constructor(mes) {
        console.log("Message: " + mes)
    }

    // Returns all users
    findAllEntries(req, res) 
    {
        User.find((err, data) => {
            if (data.length === 0)
                res.send("No data was found")
            else
                res.send(data)
        })
    }

    // Return a specific user based on the username(unique)
    findByUserName(req, res) 
    {
        let username = req.params.username;

        User.find(
            { "username": username },
            (_, data) => { res.status(200).send(data) }
        )
    }

    //create a new user and save it to DB
    async createUser(req, res) 
    {
        let { username, name, email, password } = req.body;

        //hashing the password
        const passwordHashed = await bcrypt.hash(password, 10);

        //default the email to the username + @gunsel.com.tr if no email was entered
        if (req.body.email == null || req.body.email == '')
            email = `${username}@gunsel.com.tr`


        //create a new user model and save to the DB
        const user = new User({ username, name, email, passwordHashed });

        //Generate JWT token for each created user
        let token = jwt.sign({ user }, "token",)
        user.token = token;

        //saving the user into the database
        await user.save(() => 
        {
            console.log("Datasaved");
            res.status(200).json(
                {
                    username: user.username,
                    email: email, password:
                        passwordHashed, token: user.token
                }
            )
        })
    }


    // Edit user details
    editUser(req, res) 
    {
        let id = req.params.id;
        User.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).send(id);
    }

    // Deleting users from database
    removeUser(req, res) 
    {
        id = req.params.id;

        User.findByIdAndDelete(id, () => {
            res.status(200).send("User Has Been Removed");
        });
    }


    async login(req, res) 
    {
        const { email, passwordHashed } = req.body;

        //validate if the user does exist
        const user = await User.findOne({ email })

        //validating the password
        const flag = (await bcrypt.compare(passwordHashed, user.passwordHashed));

        //assign the JWT to the user
        if (user && flag) 
        {
            const token = jwt.sign({ user });
            user.token = token;
        }

        res.status(200).send(user);
    }
}

module.exports = Users_Operation;