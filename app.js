const express = require('express');
const mongoose = require('./mongoose');
const User = require('./mongoose')
const app = express();

// Express.js set up
//app.use(express.static('./methods-public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


/****************************************/
/* GET, POST, DELETE, and PUT Requests  */
/****************************************/
app.get('/', (req, res) => {
    console.log("Hello world");
    console.log(User.findById("63d2b53b1d3c19ccde3d66c5"))
})

app.post('/create', async (req, res) => {
    const { username, name, email, password } = req.body;
 
    console.log(username, name, email, password)

    const user = new User({ username, name, email, password });
    await user.save().then(() => {
        console.log("Datasaved");
    })
    console.log("data:  ")
    console.log(user);

})

app.listen(3000, () => {
    console.log('Server is running');
})