require('dotenv').config()
const mongoose = require('mongoose')
const path = require('path')
const bcrypt = require('bcrypt')

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

// return default vendor home screen
const getVendorHome = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'vendor', 'index.html'))
}

// set van status using location provided
const postVendor = async (req, res) => {
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
    const loginID = req.body.loginID
    const pw = req.body.password
    if (loginID && pw) {
        const vendor = await db.db.collection('vendor').findOne({loginID: loginID})
        if (vendor != null) {
            // if account exists
            const valid = await bcrypt.compare(pw, vendor.password)
            if (vendor && valid) {
                // if account exists and pw is correct
                await db.db.collection('vendor').findOneAndUpdate({
                    loginID: vendor.loginID
                }, { 
                    $set:{
                        sessionID : req.sessionID,
                    }
                })
                req.session.username = loginID;

                prevPageURL = req.header('Referer');
                if (prevPageURL.search("auth") != -1 || prevPageURL.search("register") != -1) {
                    res.redirect('/customer/')
                } else {
                    res.redirect(prevPageURL);
                }
            }
            else {
                // if account did not exist or incorrect password
                res.render('loginerror');
            }
        } else {
            // if email and/or pw were empty
            res.render('loginerror')
        }
    } 
    else {
        res.render('loginerror')
    }
}

// return orders of a specific vendor van
const getOrders = async (req, res) => {
    const orders = await db.db.collection('order').find({
        vendorID: req.params.id,
        orderStatus: {
            $not: {
                $eq: "Fulfilled"
            }
        }
    }).toArray()
    res.send(orders)
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

module.exports = {
    getVendorHome,
    postVendor,
    getVendor,
    authLogin,
    getOrders,
    fulfilledOrder
}