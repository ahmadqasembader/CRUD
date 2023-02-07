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

        let flag = false;
        //redirecting to the dashboard if the user didn't logout
        if(req.headers.cookie){
            let access_token = req.headers.cookie
            access_token = access_token.split("access_token=")
            access_token = access_token[1];
            jwt.verify(access_token, config.TOKEN_KEY, (err, user) => {
                if(err)
                    return err;
                res.redirect('dashboard')
            });
        }
        
        //otherwise redirect to the login page
        res.render('login', {flag})
    }

    //display the data for logged in user
    dashboard(req, res) 
    {
        const {user} = req.body.user
        res.render('dashboard', {user})//send the data to the ejs file
    }
    
    //the POST request to login
    async login(req, res) 
    {
        //getting data from user
        let {email, password} = req.body
        let flag = false;

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
                //true to display the warning message that the password is incorrect 
                flag = true;
                res.render('login', {flag})
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

    //the POST request to create a user
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

    //find all users by going to the home page from the navbar
    findAllUsers(req, res)
    {    
        //Sending all data entry as a json
        let user;
        User.find((err, data) => {
            if (data.length === 0) {
                console.log("No data was found")
                res.send('users')
            } else {
                user = data
                res.render('users', {data})
            }
        })
    }

    /* Theses functionalities can only be tested using Postman 
    as they don't have UIs. check user_routes.js to know the url*/
    
    // Return a specific user based on the username (unique)
    findByUserName(req, res) 
    {
        let username = req.params.username;

        User.find(
            { "username": username },
            (_, data) => { res.status(200).send(data) }
        )
    }

    // Edit user details by suppling the user id
    editUser(req, res) 
    {
        let id = req.params.id;
        User.findByIdAndUpdate(id, req.body, { new: true }, () => {
            res.status(200).send(id);
        })

    }

    // Delete user by suppling the user id
    removeUser(req, res) 
    {
        const id = req.params.id;

        User.findByIdAndDelete(id, () => {
            res.status(200).send("User Has Been Removed");
        })
    }

}

module.exports = Users_Operation; 