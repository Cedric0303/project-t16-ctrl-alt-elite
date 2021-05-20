require('dotenv').config()
const bcrypt = require('bcrypt')
const db = require('../controllers/databaseController.js')
const vendorToken = require('../controllers/vendorToken')

const customerSchema = require('../models/customerSchema.js');
const foodSchema = require('../models/foodSchema.js')
const foodcategoriesSchema = require('../models/foodcategoriesSchema.js')
const orderSchema = require('../models/orderSchema.js')
const vendorSchema = require('../models/vendorSchema.js')

const Vendor = db.collection('vendor')
const Order = db.collection('order')

// return default vendor home screen (login page)
const getVendorHome = (req, res) => {
    res.render('vendor/login', {layout: 'vendor/main'})
}

// set van status using location provided
const postVendor = async (req, res) => {
    const vanID = req.params.vanID
    if (vendorToken.loggedIn(req)) {
        await Vendor.updateOne({
            loginID: vanID
        }, {
            $set: {
                isOpen: true,
                address: req.body.address,
                longitude: parseFloat(req.body.longitude),
                latitude: parseFloat(req.body.latitude)
            }
        })
        res.redirect('/vendor/' + vanID + '/orders')
    }
    else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
    }
}

// return a specific vendor van
const getVendor = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const vanID = req.params.vanID
        const vendor = await Vendor.findOne({
                loginID: vanID
            }, {
                projection: {
                    "_id": false,
                    "password": false
                }
            })
            .catch(e => console.err(e))
        res.render('vendor/openvan', {
            "vendor": vendor,
            layout: 'vendor/main'});
    } else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
    }
}

const authLogin = async (req, res) => {
    const vanID = req.body.vanID
    const pw = req.body.password
    if (vanID && pw) {
        const vendor = await Vendor.findOne({loginID: vanID})
        if (vendor != null) {
            // if account exists
            const valid = await bcrypt.compare(pw, vendor.password)
            if (vendor && valid) {
                const body = {username: vanID, vanName: vendor.vanName};
                const token = vendorToken.createToken(body)
                res.cookie("jwt_vendor", token, {httpOnly: false, sameSite:false, secure: true})
                // return the user to their previous page
                // https://stackoverflow.com/questions/12442716/res-redirectback-with-parameters
                res.redirect('/vendor/' + vanID)
            }
            else {
                // if account did not exist or incorrect password
                res.status(401)
                res.render('vendor/loginerror', {layout: 'vendor/main'});
            }
        } else {
            // if email and/or pw were empty
            res.status(401)
            res.render('vendor/loginerror', {layout: 'vendor/main'})
        }
    } 
    else {
        res.status(401)
        res.render('vendor/loginerror', {layout: 'vendor/main'})
    }
}

const closeVan = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const vanID = req.params.vanID;
        await Vendor.updateOne({
            loginID: vanID
        }, {
            $set: {
                isOpen: false
            }
        })
        res.redirect('/vendor/' + vanID)
    }
    else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
    }
}

// return orders of a specific vendor van
const getOrders = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const vanID =  req.params.vanID
        const orders = await Order.find({
            vendorID: vanID,
            orderStatus: { 
                    $not: {$eq: "Completed"}
            }
        }).toArray()
        const vendor = await Vendor.findOne({
            loginID: vanID
        }, {
            projection: {
                "_id": false,
                "password": false
            }
        })
        .catch(e => console.err(e))
        res.render('vendor/orders', {
            orders: orders,
            vendor: vendor,
            layout: 'vendor/main'
        })
    }
    else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
    }
}

const getPastOrders = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const vanID = req.params.vanID
        const orders = await Order.find({
            vendorID: vanID,
            orderStatus: { $eq: "Completed" }
        }).toArray()
        res.render('vendor/pastorders', {
            orders: orders,
            layout: 'vendor/main'})
    }
    else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
    }
}

// sets a specific order as fulfilled (made and ready to be collected)
const fulfilledOrder = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const orderID = parseInt(req.params.orderID)
        await Order.updateOne({
            orderID: orderID
        }, {
            $set: {
                orderStatus: "Fulfilled",
                fulfilledTimestamp: new Date()
            }
        })
        res.send(`<h1> Order ${req.params.orderID} fulfilled </h1>`)
    }
    else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
    }
}

// completed order
const pickedUpOrder = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const orderID = parseInt(req.params.orderID)
        await Order.updateOne({
            orderID: orderID
        }, {
            $set: {
                orderStatus: "Completed",
                completedTimestamp: new Date()
            }
        })
        res.send(`<h1> Order ${req.params.orderID} picked up </h1>`)
    } 
    else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
    }
}

const getLogout = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const token = vendorToken.getCookies(req)['jwt_vendor']
        res.cookie("jwt_vendor", token, {httpOnly: false, sameSite:false, secure: true, maxAge:1})
    } 
    else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
        return;
    }
    res.redirect('/vendor')
}

module.exports = {
    getVendorHome,
    postVendor,
    getVendor,
    authLogin,
    closeVan,
    getOrders,
    getPastOrders,
    fulfilledOrder,
    pickedUpOrder,
    getLogout
}