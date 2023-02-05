const express = require('express');
const app = express();
require('dotenv').config();
//var expressLayouts = require('express-ejs-layouts');

const user_routes = require('./routes/user_routes')
const port = process.env.port || 3000

//app.use(expressLayouts);
app.set('view engine', 'ejs')

/****************************************/
/* GET, POST, PUT, and DELETE Requests  */
/****************************************/
app.get('/', user_routes);
app.get('/about', user_routes)
app.get('/welcome', user_routes)
app.post('/login', user_routes);
app.get('/:username', user_routes);
app.post('/signup', user_routes);
app.put('/:id', user_routes);
app.delete('/:id', user_routes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});