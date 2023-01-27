const express = require('express');
const app = express();
const user_routes = require('./routes/user_routes')

const port = process.env.port || 3000

//app.use(express.static('../methods-public'))
//app.use(express.urlencoded({ extended: false }))
app.use(express.json())


/****************************************/
/* GET, POST, DELETE, and PUT Requests  */
/****************************************/
app.use(express.json())

app.get('/', user_routes);
app.post('/create', user_routes);
app.put('/:id', user_routes)
app.delete('/:id', user_routes)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})