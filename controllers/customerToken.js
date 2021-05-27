require('dotenv').config()
const jwt = require('jsonwebtoken');

// return login state
function loggedIn(req) {
    // if an username (email) is bound to session, return true for LOGGED IN
    const token = req.cookies['jwt_customer']
    if (token && jwt.verify(token, process.env.SECRET_OR_PUBLIC_KEY)) {
        return true;
    } else {
        return false;
    }
}

// create a new jsonwebtoken token
function createToken(body) {
    return jwt.sign({body}, process.env.SECRET_OR_PUBLIC_KEY);
}

// read contents in jsonwebtoken token
function getTokenPayload(token) {
    return jwt.decode(token)
}

module.exports = {
    // getCookies,
    loggedIn,
    createToken,
    getTokenPayload
}