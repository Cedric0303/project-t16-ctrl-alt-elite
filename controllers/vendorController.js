require('dotenv').config()
const mongoose = require('mongoose')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// connect to database
CONNECTION_STRING = "mongodb+srv://<username>:<password>@ctrl-alt-elite.ys2d9.mongodb.net/database?retryWrites=true&w=majority"
CONNECTION_STRING = CONNECTION_STRING.replace("<username>", process.env.MONGO_USERNAME).replace("<password>", process.env.MONGO_PASSWORD)

mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connected to Mongo ...')
})

// get all cookies from current page
// https://stackoverflow.com/a/51812642
var get_cookies = function(req) {
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
    const token = get_cookies(req)['jwt']
    if (token && jwt.verify(token, process.env.SECRET_OR_PUBLIC_KEY)) {
        return true;
    } else {
        return false;
    }
}

// return default vendor home screen (login page)
const getVendorHome = (req, res) => {
    res.render('vendorlogin',{layout: false});
    // res.sendFile(path.join(__dirname, '..', 'html', 'vendor', 'index.html'))
}

// set van status using location provided
const postVendor = async (req, res) => {
    if (loggedIn(req)) {
        db.db.collection('vendor').updateOne({
            loginID: req.params.id
        }, {
            $set: {
                isOpen: true,
                address: req.body.address,
                longitude: req.body.longitude,
                latitude: req.body.latitude
            }
        })
        res.send("<h1> Setting van status </h1>")
    }
    else {
        res.render('notloggedin')
    }
}

// return a specific vendor van
const getVendor = async (req, res) => {
    const vendor = await db.db.collection('vendor').findOne({
            loginID: req.params.id
        }, {
            projection: {
                "_id": false
            }
        })
        .catch(e => console.err(e))
    if (vendor) {
        res.send(vendor)
    } else {
        res.send('<h1> Invalid vendor loginID </h1>')
    }
}

const authLogin = async (req, res) => {
    console.log(req.body)
    const vanID = req.body.vanID
    const pw = req.body.van_pw
    if (email && pw) {
        const vendor = await db.db.collection('vendor').findOne({loginID: vanID})
        if (vendor != null) {
            // if account exists
            const valid = (pw == vendor.password)
            // const valid = await bcrypt.compare(pw, vendor.password)
            if (vendor && valid) {
                // if account exists and pw is correct
                // await db.db.collection('customer').findOneAndUpdate({
                //     loginID: user.loginID
                // }, { 
                //     $set:{
                //         sessionID : req.sessionID,
                //         // expiryDate : new Date(Date.now() + hour)
                //     }
                // })
                const body = {username: vanID, vanName: vendor.vanName};
                const token = jwt.sign({body}, process.env.SECRET_OR_PUBLIC_KEY);
                res.cookie("jwt", token, {httpOnly: false, sameSite:false, secure: true})
                // res.session.maxAge = new Date(Date.now() + hour);
                // res.session.cookie.maxAge = hour;
                // return the user to their previous page
                // https://stackoverflow.com/questions/12442716/res-redirectback-with-parameters
                prevPageURL = req.header('Referer');
                if (prevPageURL.search("auth") != -1) {
                    res.redirect('/vendor/')
                } else {
                    res.send('hi')
                }
            }
            else {
                // if account did not exist or incorrect password
                res.send('wtf')
            }
        } else {
            // if email and/or pw were empty
            res.send('wtf2')
        }
    } 
    else {
        res.send('wtf3')
    }
}

// return orders of a specific vendor van
const getOrders = async (req, res) => {
    if (loggedIn(req)) {
        const orders = await db.db.collection('order').find({
            vendorID: req.params.id,
            orderStatus: { 
                $or: [{
                    $not: {$eq: "Fulfilled"}
                },{
                    $not: {$eq: "Completed"}
                }]
            }
        }).toArray()
        res.send(orders)
    }
    else {
        res.render('notloggedin')
    }
}

// sets a specific order as fulfilled
const fulfilledOrder = async (req, res) => {
    await db.db.collection('order').updateOne({
        orderID: {
            $eq: Number(req.params.orderID)
        }
    }, {
        $set: {
            orderStatus: "Fulfilled"
        }
    })
    res.send(`<h1> Order ${req.params.orderID} fulfilled </h1>`)
}

const pickedUpOrder = async (req, res) => {
    await db.db.collection('order').updateOne({
        orderID: {
            $eq: Number(req.params.orderID)
        }
    }, {
        $set: {
            orderStatus: "Completed"
        }
    })
    res.send(`<h1> Order ${req.params.orderID} fulfilled </h1>`)
}

const getLogout = async (req, res) => {
    if (loggedIn(req)) {
        const token = get_cookies(req)['jwt']
        res.cookie("jwt", token, {httpOnly: false, sameSite:false, secure: true, maxAge:1})
    } else {
        res.render('notloggedin');
        return;
    }
    res.redirect('/vendor/')
}

module.exports = {
    getVendorHome,
    postVendor,
    getVendor,
    authLogin,
    getOrders,
    fulfilledOrder,
    pickedUpOrder,
    getLogout
}