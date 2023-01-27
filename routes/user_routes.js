const User = require('../mongoose');
const express = require('express');
var jwt = require('jsonwebtoken');
const router = express.Router();

router.use(express.json())

router.get('/', (req, res) => {

    //Sending all data entry as a json
    let entry;
    User.find((err, data) => {
        if (err) {
            console.log(err.message)
            return;
        } else if (data.length === 0) { 
            //if no entries in DB send 404 page
            res.send("No data was found")
        } else {
            console.log(data)
            entry = data
            res.send(entry)
        }
    })
  
})

router.post('/create', async (req, res) => {
    let { username, name, email, password } = req.body;

    //default the email to the username + @gunsel.com.tr if no email was entered
    if (req.body.email == null || req.body.email === ' ') {
        email = `${username}@gunsel.com.tr`
    }

    //create a new user model and save to the DB
    let user = new User({ username, name, email, password });
    // const newUser = await user.save()
    //Generate JWT token for each created user
    let token = jwt.sign({ user }, "token")
    console.log(token)

    // res.status(200).json({username:newUser.username})

    await user.save().then((user) => {
        console.log("Datasaved");
        res.status(200).json({username:user.username})
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