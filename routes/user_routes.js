const mongoose = require('mongoose');
const User = require('../mongoose');
const express = require('express');
var jwt = require('jsonwebtoken');
const router = express.Router();


router.get('/', (req, res) => {

    //Sending all data entry as a json
    let entry;
    User.find((err, data) => {
        if (err) {
            console.log(err.message)
            return;
        } else if (data.length === 0) {
            //send 404 page
            res.send("No data was found")
        } else {
            entry = data
            res.send(entry)
        }
    })
})

router.post('/create', async (req, res) => {
    let { username, name, email, password } = req.body;

    //defulat the email to the username + @gunsel.com.tr if no email was entered
    if (req.body.email == null || req.body.email === ' ') {
        email = `${username}@gunsel.com.tr`
    }

    //create a new user model and save to the DB
    let user = new User({ username, name, email, password });
    let token = jwt.sign({ user }, "token")
    console.log(token)
    await user.save().then(() => {
        console.log("Datasaved");
    }).catch((err) => console.log(err.message))
    
})


router.put('/:id', (req, res) => {
    let id = req.params.id;

    User.findByIdAndUpdate(id, req.body, { new: true })
        .catch(err => console.log(err));
})

router.delete('/:id', (req, res) => {
    id = req.params.id;
    console.log("DELETE REQUEST ID = " + id)
    User.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                console.log("Not found")
            }
        })
        .catch(err => console.log(err))
})
module.exports = router;