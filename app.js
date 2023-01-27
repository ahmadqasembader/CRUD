const express = require('express');
const app = express();
const user_routes = require('./routes/user_routes')

const port = process.env.port || 3000


/****************************************/
/* GET, POST, PUT, and DELETE Requests  */
/****************************************/
app.get('/', user_routes);
app.post('/create', user_routes);
app.put('/:id', user_routes)
app.delete('/:id', user_routes)


app.listen(port, () => {console.log(`Server is running on port ${port}`);})