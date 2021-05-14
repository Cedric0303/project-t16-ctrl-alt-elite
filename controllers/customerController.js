require('dotenv').config()
const mongoose = require('../controllers/databaseController.js')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const db = mongoose.connection;

const Customer = require('../models/customerSchema.js');
const Food = require('../models/foodSchema.js')
const FoodCategories = require('../models/foodcategoriesSchema.js')
const Order = require('../models/orderSchema.js')
const Vendor = require('../models/vendorSchema.js')


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

// return default customer homescreen
const getCustomerHome = async (req, res) => {
    const vans = await db.db.collection('vendor').find({}).project({
        "_id": false,
        "password": false
    }).toArray()
    res.render('customer/home', {
        "vans": vans,
        layout: 'customer/homepage'})
}

// get food items from the database and return it
const getMenu = async (req, res) => {
    const result = await db.db.collection('food').find({}).project({
        "_id": false
    }).toArray()
    if (result) {
        res.send(result)
    } else {
        res.send("ERROR")
    }
}

const getMenuVan = async (req, res) => {
    const menu = await db.db.collection('food').find({}).project({
        "_id": false
    }).toArray()
    const menucategories = await db.db.collection('foodcategories').find({}).project({
        "_id": false
    }).toArray()
    const vendorinfo = await db.db.collection('vendor').findOne({
        loginID: req.params.vanId
    }, {
        projection: {
            "_id": false,
            "password": false
        }
    })
    .catch(e => console.err(e))
    var dist = req.query.dist
    if (menu && vendorinfo) {
        res.render('customer/menu', {
            "dist":dist,
            "menu":menu, // passing menu array as "menu"
            "menucat":menucategories, // passing menu categories array as "menucat""
            "van":vendorinfo, // passing selected vendor info json object as "van"
            layout: 'customer/vanselectedsearchcart'})
    } else {
        res.send('<h1> Error getting vendor/menu info </h1>')
    }
}

const postNewOrder = async (req, res) => {
    if (loggedIn(req)) {
        orderInfo = JSON.parse(req.body.payload);
        orderTotal = 0;
        for (var item in orderInfo.item) {
            // replace price and total from customer app with values from db
            // prevents changing the prices from customer app
            const price = await db.db.collection('food').findOne({
                    name: orderInfo.item[item].name
                }, {
                    projection: {
                        "_id": false,
                        "price": true
                    }
                })
                .catch(e => console.err(e));
            priceNum = parseFloat(price.price)
            orderInfo.item[item].price = priceNum;
            orderInfo.item[item].total = priceNum*orderInfo.item[item].count;
            orderTotal += orderInfo.item[item].total;
        }
        const token = get_cookies(req)['jwt']
        const payload = jwt.decode(token)
        const orderID = parseInt(new Date().getTime())
        const order = new Order({
            item: orderInfo["item"],
            orderTotal: orderTotal,
            timestamp: new Date(),
            vendorID: orderInfo["vendorID"],
            customerID: payload.body.username,
            customerGivenName: payload.body.nameGiven,
            orderStatus: "Ordering",
            orderID: orderID
        });
        const error = order.validateSync()
        if (error == undefined) {
            await db.db.collection('order').insertOne(order);
            res.redirect('/customer/orders/' + orderID)
        } else {
            // print cart error message
        }
    } else {
        res.render('customer/notloggedin', {layout: 'customer/navbar'});
    }
}

// return individual order page
const getOrderDetail = async (req, res) => {
    const order = await db.db.collection('order').findOne({
        orderID: parseInt(req.params.orderID)
    })
    res.render('customer/orderstatus', {
        order: order,
        layout: 'customer/orderstatus'
    })
}

// return order modification page
const getModifyPage = async (req, res) => {
    if (loggedIn(req)) {
        res.render('customer/menu', {layout: 'customer/editorder'})
    }
    else {
        res.render('customer/notloggedin', {layout: 'customer/navbar'})
    }
}

// update order in database with new modified order
const modifyOrder = async (req, res) => {
    if (loggedIn(req)) {
        orderInfo = JSON.parse(req.body.payload);
        orderTotal = 0;
        for (var item in orderInfo.item) {
            // replace price and total from customer app with values from db
            // prevents changing the prices from customer app
            const price = await db.db.collection('food').findOne({
                    name: orderInfo.item[item].name
                }, {
                    projection: {
                        "_id": false,
                        "price": true
                    }
                })
                .catch(e => console.err(e));
            priceNum = parseFloat(price.price)
            orderInfo.item[item].price = priceNum;
            orderInfo.item[item].total = priceNum*orderInfo.item[item].count;
            orderTotal += orderInfo.item[item].total;
        }
        const token = get_cookies(req)['jwt']
        const payload = jwt.decode(token)
        const orderID = req.params.orderID
        await db.db.collection('order').findOneAndUpdate({
            orderID: parseInt(orderID)
        }, {
            $set: {
                item: orderInfo["item"],
                orderTotal: orderTotal,
                timestamp: new Date(),
                vendorID: orderInfo["vendorID"],
                customerID: payload.body.username,
                customerGivenName: payload.body.nameGiven,
                orderStatus: "Ordering",
            }
        })
        res.redirect('/customer/orders/' + orderID)
    }
    else {
        res.render('customer/notloggedin', {layout: 'customer/navbar'})
    }
}

// delete an order in the database
const cancelOrder = async (req, res) => {
    if (loggedIn(req)) {
        const orderID = req.params.orderID
        await db.db.collection('order').deleteOne({
            orderID: parseInt(orderID)
        })
        res.redirect('/customer/')
    }
    else {
        res.render('customer/notloggedin', {layout: 'customer/navbar'})
    }
}

// return order review page
const updateOrderStatus  = async (req, res) => {
    res.send('<h1>Update order status</h1>')
}

// add order review into database
const postReview = async (req, res) => {
    const orderID = parseInt(req.params.orderID)
    // const review = req.body.blablabla
    await db.db.collection('order').findOneAndUpdate({
        orderID: orderID
    }, {
        $set: {
            rating: "",
            comment: ""
        }
    })
    res.send("<h1>Thanks.</h1>")
}

// return information for a given food item
const getFoodDetails = async (req, res) => {
    const result = await db.db.collection('food').findOne({
            name: req.params.name
        }, {
            projection: {
                "_id": false
            }
        })
        .catch(e => console.err(e))
    res.send(result)
}

// DEPRECATED
// create a new order and add a specified food into the order
const addFoodToOrder = async (req, res) => {
    const food = await db.db.collection('food').findOne({
        name: req.params.name
    })
    const customer = await db.db.collection('customer').findOne({
        loginID: req.body.loginID
    })
    await db.db.collection('order').insertOne({
        item: [{
            foodID: {
                $toString: food._ID
            },
            name: food.name,
            count: req.body.count
        }],
        timestamp: new Date(),
        vendorID: req.body.vendorID,
        customerID: customer.loginID,
        customerGivenName: customer.nameGiven,
        orderStatus: "Ordering",
        orderID: Math.floor((Math.random() * 1000000) + 1)
    })
    res.send(`<h1> Added ${food.name} to order </h1>`)
}

// return customer login page
const getLogin = (req, res) => {
    res.render('customer/login', {layout: 'customer/navbar'})
}

const authLogin = async (req, res) => {
    const email = req.body.email
    const pw = req.body.password
    if (email && pw) {
        const user = await db.db.collection('customer').findOne({loginID: email})
        if (user != null) {
            // if account exists
            const valid = await bcrypt.compare(pw, user.password)
            if (user && valid) {
                const body = {username: email, nameGiven: user.nameGiven};
                const token = jwt.sign({body}, process.env.SECRET_OR_PUBLIC_KEY);
                res.cookie("jwt", token, {httpOnly: false, sameSite:false, secure: true})
                // return the user to their previous page
                // https://stackoverflow.com/questions/12442716/res-redirectback-with-parameters
                prevPageURL = req.header('Referer');
                if (prevPageURL.search("auth") != -1 || prevPageURL.search("register") != -1) {
                    res.redirect('/customer/')
                } else {
                    res.redirect(prevPageURL);
                }
            }
            else {
                // if account did not exist or incorrect password
                res.render('customer/loginerror', {layout: 'customer/navbar'});
            }
        } else {
            // if email and/or pw were empty
            res.render('customer/loginerror', {layout: 'customer/navbar'})
        }
    } 
    else {
        res.render('customer/loginerror', {layout: 'customer/navbar'})
    }
}

const getRegister = async (req, res) => {
    res.render('customer/register', {layout: 'customer/navbar'})
}

const addCustomer = async (req, res) => {
    // if email does not exist in database, then add an account, if not render dupe account handlebar
    const user = await db.db.collection('customer').findOne({loginID: req.body.email});
    if (user == null) {
        const hash_pw = await bcrypt.hash(req.body.password, parseInt(process.env.SALT))
        const newUser = new Customer({
            nameGiven: req.body.firstName,
            nameFamily: req.body.lastName,
            loginID: req.body.email,
            password: hash_pw
        })
        const error = newUser.validateSync()
        if (error == undefined) {
            await db.db.collection('customer').insertOne(newUser)
            res.render('customer/loginnewacc', {layout: 'customer/navbar'});
        } else {
            // print register account error
        }
    } else {
        res.render('customer/registeremaildupe', {layout: 'customer/navbar'});
    }
}

const getOrders = async (req, res) => {
    if (loggedIn(req)) {
        const token = get_cookies(req)['jwt']
        const payload = jwt.decode(token)
        const username = payload.body.username
        const orders = await db.db.collection('order').find({
            "customerID": username
        }).project({}).sort({"timestamp": -1}).toArray()
        if (orders) {
            res.render('customer/orders', {
                "orders": orders, // passing orders from db into orders.hbs as orders
                layout: 'customer/orderspage'
            })
        } else {
            res.send("ERROR")
        }
    } else {
        res.render('customer/notloggedin', {layout: 'customer/navbar'});
    }
}

const getProfile = async (req, res) => {
    if (loggedIn(req)) {
        const token = get_cookies(req)['jwt']
        const payload = jwt.decode(token)
        const email = payload.body.username
        const user = await db.db.collection('customer').findOne({
            loginID: email
        }, {
            "projection": {
                "_id": false,
                "password": false
            }
        });
        res.render('customer/profile', {
            "user": user,
            layout: 'customer/navbar'
        })
    } else {
        res.render('customer/notloggedin', {layout: 'customer/navbar'});
    }
}

// update account details
const updateAccount = async (req, res) => { 
    const token = get_cookies(req)['jwt']
    const payload = jwt.decode(token)
    const email = payload.body.username
    const user = await db.db.collection('customer').findOne({loginID: email},{
        "projection": {
            "_id": false,
            "password": false
        }
    });
    if (req.body.updatetype == "name") {
        firstname = req.body.firstName.trim()
        lastname = req.body.lastName.trim()
        if (!firstname && !lastname) {
            // no changes to name
        } else if (firstname && lastname) {
            // both first and last name changed
            await db.db.collection('customer').findOneAndUpdate({
                loginID: user.loginID
            }, { 
                $set:{
                    nameGiven : req.body.firstName.trim(),
                    nameFamily : req.body.lastName.trim()
                }
            });
        } else if (firstname) {
            // first name changed
            await db.db.collection('customer').findOneAndUpdate({
                loginID: user.loginID
            }, { 
                $set:{
                    nameGiven : req.body.firstName.trim()
                }
            });
        } else if (lastname) {
            // last name changed
            await db.db.collection('customer').findOneAndUpdate({
                loginID: user.loginID
            }, { 
                $set:{
                    nameFamily : req.body.lastName.trim()
                }
            });
        }
    } else if (req.body.updatetype == "pw") {
        if (!req.body.password) {
            // no change to password
        } else if (req.body.password) {
            const hash_pw = await bcrypt.hash(req.body.password, parseInt(process.env.SALT));
            await db.db.collection('customer').findOneAndUpdate({
                loginID: user.loginID
            }, { 
                $set:{
                    password : hash_pw
                }
            });
        }
    }
    res.redirect('profile');
}

// logout current user from website and remove user token
const getLogout = async (req, res) => {
    if (loggedIn(req)) {
        const token = get_cookies(req)['jwt']
        res.cookie("jwt", token, {httpOnly: false, sameSite:false, secure: true, maxAge:1})
    } else {
        res.render('customer/notloggedin', {layout: 'customer/navbar'});
        return;
    }
    res.redirect('/customer/')
}


module.exports = {
    getCustomerHome,
    getMenu,
    getMenuVan,
    postNewOrder,
    getModifyPage,
    getOrderDetail,
    modifyOrder,
    cancelOrder,
    getFoodDetails,
    updateOrderStatus,
    postReview,
    addFoodToOrder,
    getLogin,
    authLogin,
    getRegister,
    addCustomer,
    getOrders,
    getProfile,
    updateAccount,
    getLogout
}