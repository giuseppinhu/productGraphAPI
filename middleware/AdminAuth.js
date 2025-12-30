const jwt = require('jsonwebtoken');

const secret = "hjldasflhkj"

const AdminAuth = (req, res, next) => {
    const token = req.headers['authorization'];

    if(token === undefined) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const bearer = token.split(' ');
    const authToken = bearer[1];

    try {
        const decoded = jwt.verify(authToken, secret);

       if(decoded.role === 1) {
            next()
       } else {
            return res.status(403).json({ message: 'Access denied' });
       }
    
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = AdminAuth;