const User = require('../mongoose');
const express = require('express');
var jwt = require('jsonwebtoken');
const router = express.Router();

router.use(express.json())

// Return all entries in database
router.get('/', (req, res) => {

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

})

// Return data for the specified username
router.get('/:username', (req, res) => {
    let username = req.params.username;

    User.find(
        { "usernane": username },
        (_, data) => {
            res.status(200).send(data)
        }
    )
})

router.post('/create', async (req, res) => {
    let { username, name, email, password } = req.body;

    //default the email to the username + @gunsel.com.tr if no email was entered
    if (req.body.email == null || req.body.email === '') {
        console.log("PLease enter email")
        email = `${username}@gunsel.com.tr`
    }

    //create a new user model and save to the DB
    let user = new User({ username, name, email, password });

    //Generate JWT token for each created user
    let token = jwt.sign({ user }, "token")

    await user.save().then((user) => {
        console.log("Datasaved");
        res.status(200).json({ username: user.username })
    }).catch((err) => console.log(err.message))
    return user;
})

router.put('/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndUpdate(id, req.body, { new: true })
        .catch(err => console.log(err));
})


router.delete('/:id', (req, res) => {
    id = req.params.id;

    User.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                console.log("Not found")
            }
        })
        .catch(err => console.log(err))
})

module.exports = router;