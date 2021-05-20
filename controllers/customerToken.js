require('dotenv').config()
const jwt = require('jsonwebtoken');

// get all cookies from current page
// https://stackoverflow.com/a/51812642
var getCookies = function(req) {
    var cookies = {};
    req.headers && req.headers.cookie.split(';').forEach(function(cookie) {
      var parts = cookie.match(/(.*?)=(.*)$/)
      cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies;
};

// return login state
function loggedIn(req) {
    // if an username (email) is bound to session, return true for LOGGED IN
    const token = get_cookies(req)['jwt_customer']
    if (token && jwt.verify(token, process.env.SECRET_OR_PUBLIC_KEY)) {
        return true;
    } else {
        return false;
    }
}
function createToken(body) {
    return jwt.sign({body}, process.env.SECRET_OR_PUBLIC_KEY);
}

function getTokenPayload(token) {
    return jwt.decode(token)
}

module.exports = {
    getCookies,
    loggedIn,
    createToken,
    getTokenPayload
}