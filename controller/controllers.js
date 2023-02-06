const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../mongoose');
require('dotenv').config();

const config = process.env

class Users_Operation 
{
    constructor(mes) 
    {
        console.log("Message: " + mes)
    }

    // Login page
    index(req, res) 
    {
        let access_token = req.headers.cookie
        access_token = access_token.split("access_token=")
        access_token = access_token[1];
        jwt.verify(access_token, config.TOKEN_KEY, (err, user) => {
            if(err)
                return err;
            res.redirect('dashboard')
        });
        if(req.headers.cookie)
        res.render('login')
    }


    dashboard(req, res) 
    {
        const {user} = req.body.user
        res.render('dashboard', {user})
    }
    
    async login(req, res) 
    {
        //getting data from user
        let {email, password} = req.body
        try {
            const user = await User.findOne({ email })

            //assign the JWT to the user
            //authenticate the given password
            if (user && (await bcrypt.compare(password, user.passwordHashed))) 
            {
                const token = jwt.sign({user}, config.TOKEN_KEY, {expiresIn: "24h"})
                
                //storing the jwt token inside an http cookie
                res.cookie("access_token", token, {httpOnly: true})

                //redirecting to the dashboard which contains an authenticator middlerware
                //to authenticate the jwt token
                res.redirect('/dashboard')
            }
            else
            {
                res.send("<a href='/'>Username or password is incorrect</a>")
            }
        } 
        catch (error) 
        {
            res.json(error)
        }
    }

    //Sign up page
    singup(req, res)
    {
        res.render('signup')
    }

    logout(req, res)
    {
        res.clearCookie("access_token")
        res.redirect('/')
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

        try {
            //create a new user model and save to the DB
            const user = new User({ username, name, email, passwordHashed })
            if(await User.findOne({ username })){
                //return res.render('error', {username})
            }
            //Generate JWT token for each created user
            const token = jwt.sign({user}, config.TOKEN_KEY, {expiresIn: "24h"})
            user.token = token;
            res.cookie("access_token", token, {httpOnly: true})

            //saving the user into the database
            user.save((user) => {
                res.redirect('dashboard')
            })

        } catch (err) {
            res.status(404).send(Error);
        }
    }


    // Return a specific user based on the username (unique)
    findByUserName(req, res) 
    {
        let username = req.params.username;

        User.find(
            { "username": username },
            (_, data) => { res.status(200).send(data) }
        )
    }

    // Edit user details
    editUser(req, res) 
    {
        let id = req.params.id;
        User.findByIdAndUpdate(id, req.body, { new: true }, () => {
            res.status(200).send(id);
        })

    }

    // Deleting users from database
    removeUser(req, res) 
    {
        const id = req.params.id;

        User.findByIdAndDelete(id, () => {
            res.status(200).send("User Has Been Removed");
        })
    }

}

module.exports = Users_Operation;