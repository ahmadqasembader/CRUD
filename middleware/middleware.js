const jwt = require("jsonwebtoken");

const config = process.env;

const auth = (req, res, next) => 
{
    const token = req.headers.token
    
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try 
    {
        jwt.verify(token, config.TOKEN_KEY, 
            (err, user) => 
            {
                if(err) return;
                req.user = user
                next()
            }
        );

    } catch (err) 
    {
        res.status(401).send("Invalid Token");
    }
};

module.exports = auth;
