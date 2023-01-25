const express = require('express');
const mongoose = require('./mongoose');
const User = require('./mongoose')
const app = express();

// Express.js set up
app.use(express.static('./methods-public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


//const user = new User({ username: "ahmad", name: "ahmad", email: "ahmad.bader@gunsel.com.tr", password: "bjhksv" });
//console.log(user);

/****************************************/
/* GET, POST, DELETE, and PUT Requests  */
/****************************************/
app.get('/', (req, res) => { 
    res.send('Hello World')
})

app.post('/create', async (req, res) => {
    const { username, name, email, password } = req.body;

    console.log(username, name, email, password)
    
    const user = new User({username, name, email, password});
    user.save()
    console.log(user);

})

app.listen(3000, () => {
    console.log('Server is running');
})
