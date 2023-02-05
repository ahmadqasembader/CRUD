const express = require('express');
const app = express();
require('dotenv').config();

const user_routes = require('./routes/user_routes')
const port = process.env.port || 3000

app.set('view engine', 'ejs')

/****************************************/
/* GET, POST, PUT, and DELETE Requests  */
/****************************************/
app.get('/', user_routes);
app.post('/login', user_routes);
app.post('/signup', user_routes);
app.get('/dashboard', user_routes)

app.get('/:username', user_routes);
app.put('/:id', user_routes);
app.delete('/:id', user_routes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});