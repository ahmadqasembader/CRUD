const express = require('express')
const User = require('./mongoose')
const app = express();

// Express.js set up
app.use(express.static('./methods-public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



/****************************************/
/* GET, POST, DELETE, and PUT Requests  */
/****************************************/
app.get('/', (req, res) => {
    res.send('Hello World')
})

async function run() {
    try{
        const user = await User.find({name: "ahmad"})
    }catch (err){
        console.log(err.message)
    }
}


app.post('/create',  async (req, res) => {
    const { username, name, email, password } = req.body;

    console.log( username, name, email, password)
    const user = await User.create({
        username, 
        name, 
        email, 
        password
    })
    console.log(user)
    //const user = await new User({username, name, email, password});
    //await user.save()

})

app.listen(3100, () => {
    console.log('Server is running');
})
