require('dotenv').config()
const bcrypt = require('bcrypt')
const db = require('../controllers/databaseController.js')
const vendorToken = require('../controllers/vendorToken')

const customerSchema = require('../models/customerSchema.js');
const foodSchema = require('../models/foodSchema.js')
const foodcategoriesSchema = require('../models/foodcategoriesSchema.js')
const orderSchema = require('../models/orderSchema.js')
const vendorSchema = require('../models/vendorSchema.js')

const constants = require("../controllers/constants.js")

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

// authenticate vendor login details
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
                res.cookie("jwt_vendor", token, {
                    httpOnly: false, 
                    sameSite: false, 
                    secure: true,
                    maxAge: constants.VENDORTOKENTIME,
                })
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

// close a specified vendor van
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
        var orders = [];
        const ordersOrdering = await Order.find({
            vendorID: vanID,
            orderStatus: { 
                    $eq: "Ordering"
            }
        }).project({
            "_id": false,
            "password": false
        })
        .sort({"timestamp": 1}) // sort by oldest first
        .toArray()
        const ordersFulfilled = await Order.find({
            vendorID: vanID,
            orderStatus: { 
                    $eq: "Fulfilled"
            }
        }).project({
            "_id": false,
            "password": false
        })
        .sort({"timestamp": 1}) // sort by oldest first
        .toArray()
        orders.push(...ordersOrdering)
        orders.push(...ordersFulfilled)
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

// return past orders of a specific vendor van
const getPastOrders = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const vanID = req.params.vanID
        const orders = await Order.find({
            vendorID: vanID,
            orderStatus: { 
                $eq: "Completed" 
            }
        }).project({
            "_id": false,
            "password": false
        })
        .sort({"timestamp": -1})
        .toArray()
        res.render('vendor/pastorders', {
            orders: orders,
            layout: 'vendor/main'})
    }
    else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
    }
}

// set a specific order as fulfilled (made and ready to be collected)
const fulfilledOrder = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const orderID = parseInt(req.params.orderID)
        const order = await Order.findOne({
            orderID: orderID
        })
        const curTime = new Date()
        // apply discount if necessary
        var orderTotal = order.orderTotal
        if (((curTime.getTime() - new Date(order.timestamp).getTime()) / 1000) >= constants.DISCOUNTTIME) {
            orderTotal = Number(order.orderTotal - (order.orderTotal * constants.DISCOUNTVALUE)).toFixed(2)
            await Order.updateOne({
                orderID: orderID
            }, {
                $set: {
                    orderStatus: "Fulfilled",
                    fulfilledTimestamp: curTime,
                    orderTotal: Number(orderTotal),
                    discounted: true
                }
            })
        } else {
            await Order.updateOne({
                orderID: orderID
            }, {
                $set: {
                    orderStatus: "Fulfilled",
                    fulfilledTimestamp: curTime,
                    orderTotal: Number(orderTotal),
                    discounted: false
                }
            })
        }
        res.status(202)
    }
    else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
    }
}

// set a specific order as completed (made and collected)
const pickedUpOrder = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const orderID = parseInt(req.params.orderID)
        const curTime = new Date()
        await Order.updateOne({
            orderID: orderID
        }, {
            $set: {
                orderStatus: "Completed",
                completedTimestamp: curTime
            }
        })
        res.status(202)
    } 
    else {
        res.status(402)
        res.render('vendor/notloggedin', {layout: 'vendor/main'})
    }
}

// set vendor as logged out
const getLogout = async (req, res) => {
    if (vendorToken.loggedIn(req)) {
        const token = req.cookies['jwt_vendor']
        res.cookie("jwt_vendor", token, {httpOnly: false, sameSite: false, secure: true, maxAge:1})
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