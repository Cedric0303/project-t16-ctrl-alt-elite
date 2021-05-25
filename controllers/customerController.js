require('dotenv').config()
const bcrypt = require('bcrypt')
const db = require('../controllers/databaseController.js')
const customerToken = require('../controllers/customerToken')

const customerSchema = require('../models/customerSchema.js');
const foodSchema = require('../models/foodSchema.js')
const foodcategoriesSchema = require('../models/foodcategoriesSchema.js')
const orderSchema = require('../models/orderSchema.js')
const vendorSchema = require('../models/vendorSchema.js')

const Customer = db.collection('customer')
const Food = db.collection('food')
const FoodCategories = db.collection('foodcategories')
const Order = db.collection('order')
const Vendor = db.collection('vendor')


// return default customer homescreen
const getCustomerHome = async (req, res) => {
    const vans = await Vendor.find({}).project({
        "_id": false,
        "password": false
    }).toArray()
    res.render('customer/home', {
        "vans": vans,
        layout: 'customer/homepage'})
}

// return customer homescreen with pre-selected van 
const getCustomerHomeVan = async (req, res) => {
    const vans = await Vendor.find({}).project({
        "_id": false,
        "password": false
    }).toArray()
    res.render('customer/home', {
        "vans": vans,
        layout: 'customer/homepage'})
}

const getMenuVan = async (req, res) => {
    const menu = await Food.find({}).project({
        "_id": false
    }).toArray()
    const menucategories = await FoodCategories.find({}).project({
        "_id": false
    }).toArray()
    const vendorinfo = await Vendor.findOne({
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
    if (customerToken.loggedIn(req)) {
        orderInfo = JSON.parse(req.body.payload);
        orderTotal = 0;
        for (var item in orderInfo.item) {
            // replace price and total from customer app with values from db
            // prevents changing the prices from customer app
            const food = await Food.findOne({
                    id: orderInfo.item[item].id
                }, {
                    projection: {
                        "_id": false,
                        "name": true,
                        "price": true
                    }
                })
                .catch(e => console.err(e));
            priceNum = parseFloat(food.price);
            orderInfo.item[item].name = food.name;
            orderInfo.item[item].price = priceNum;
            orderInfo.item[item].total = priceNum*orderInfo.item[item].count;
            orderTotal += orderInfo.item[item].total;
        }
        const token = req.cookies['jwt_customer']
        const payload = customerToken.getTokenPayload(token)
        const orderID = parseInt(new Date().getTime())
        const order = new orderSchema({
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
            await Order.insertOne(order);
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
    const order = await Order.findOne({
        orderID: parseInt(req.params.orderID)
    })
    const vendorinfo = await Vendor.findOne({
        loginID: order.vendorID
    }, {
        projection: {
            "vanName": true,
            "address": true
        }
    })
    res.render('customer/orderstatus', {
        order: order,
        van: vendorinfo,
        layout: 'customer/orderstatus'
    })
}

// return order modification page
const getModifyPage = async (req, res) => {
    if (customerToken.loggedIn(req)) {
        res.render('customer/menu', {layout: 'customer/editorder'})
    }
    else {
        res.render('customer/notloggedin', {layout: 'customer/navbar'})
    }
}

// update order in database with new modified order
const modifyOrder = async (req, res) => {
    if (customerToken.loggedIn(req)) {
        orderInfo = JSON.parse(req.body.payload);
        orderTotal = 0;
        for (var item in orderInfo.item) {
            // replace price and total from customer app with values from db
            // prevents changing the prices from customer app
            const price = await Food.findOne({
                    id: orderInfo.item[item].id
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
        const token = req.cookies['jwt_customer']
        const payload = customerToken.getTokenPayload(token)
        const orderID = parseInt(req.params.orderID)
        await Order.findOneAndUpdate({
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
    if (customerToken.loggedIn(req)) {
        const orderID = parseInt(req.params.orderID)
        await Order.deleteOne({
            orderID: parseInt(orderID)
        })
        res.redirect('/customer/')
    }
    else {
        res.render('customer/notloggedin', {layout: 'customer/navbar'})
    }
}

// return order review page
const getReview  = async (req, res) => {
    const orderID = parseInt(req.params.orderID)
    res.render('customer/orderstatus', {layout: 'customer/navbar'})
}

// add order review into database
const postReview = async (req, res) => {
    const orderID = parseInt(req.params.orderID)
    const rating = req.body.rating
    const review = req.body.review
    await Order.findOneAndUpdate({
        orderID: orderID
    }, {
        $set: {
            rating: rating,
            comment: review
        }
    })
    res.send("<h1>Thanks.</h1>")
}

// return customer login page
const getLogin = (req, res) => {
    res.render('customer/login', {layout: 'customer/navbar'})
}

const authLogin = async (req, res) => {
    const email = req.body.email
    const pw = req.body.password
    const tokenTime = 2 * 60 * 60 * 1000 // 2 hours
    if (email && pw) {
        const user = await Customer.findOne({loginID: email})
        if (user != null) {
            // if account exists
            const valid = await bcrypt.compare(pw, user.password)
            if (user && valid) {
                const body = {username: email, nameGiven: user.nameGiven};
                const token = customerToken.createToken(body)
                res.cookie("jwt_customer", token, {
                    httpOnly: false,
                    sameSite:false,
                    secure: true,
                    maxAge: tokenTime,
                })
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
    const user = await Customer.findOne({loginID: req.body.email});
    if (user == null) {
        const hash_pw = await bcrypt.hash(req.body.password, parseInt(process.env.SALT))
        const newUser = new customerSchema({
            nameGiven: req.body.firstName,
            nameFamily: req.body.lastName,
            loginID: req.body.email,
            password: hash_pw
        })
        const error = newUser.validateSync()
        if (error == undefined) {
            await Customer.insertOne(newUser)
            res.render('customer/loginnewacc', {layout: 'customer/navbar'});
        } else {
            // print register account error
        }
    } else {
        res.render('customer/registeremaildupe', {layout: 'customer/navbar'});
    }
}

const getOrders = async (req, res) => {
    if (customerToken.loggedIn(req)) {
        const token = req.cookies['jwt_customer']
        const payload = customerToken.getTokenPayload(token)
        const username = payload.body.username
        const orders = await Order.find({
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
    if (customerToken.loggedIn(req)) {
        const token = req.cookies['jwt_customer']
        const payload = customerToken.getTokenPayload(token)
        const email = payload.body.username
        const user = await Customer.findOne({
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
    const token = req.cookies['jwt_customer']
    const payload = customerToken.getTokenPayload(token)
    const email = payload.body.username
    const user = await Customer.findOne({loginID: email},{
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
            await Customer.findOneAndUpdate({
                loginID: user.loginID
            }, { 
                $set:{
                    nameGiven : req.body.firstName.trim(),
                    nameFamily : req.body.lastName.trim()
                }
            });
        } else if (firstname) {
            // first name changed
            await Customer.findOneAndUpdate({
                loginID: user.loginID
            }, { 
                $set:{
                    nameGiven : req.body.firstName.trim()
                }
            });
        } else if (lastname) {
            // last name changed
            await Customer.findOneAndUpdate({
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
            await Customer.findOneAndUpdate({
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
    if (customerToken.loggedIn(req)) {
        const token = req.cookies['jwt_customer']
        res.cookie("jwt_customer", token, {httpOnly: false, sameSite:false, secure: true, maxAge:1})
    } else {
        res.render('customer/notloggedin', {layout: 'customer/navbar'});
        return;
    }
    res.redirect('/customer/')
}


module.exports = {
    getCustomerHome,
    getCustomerHomeVan,
    getMenuVan,
    postNewOrder,
    getModifyPage,
    getOrderDetail,
    modifyOrder,
    cancelOrder,
    getReview,
    postReview,
    getLogin,
    authLogin,
    getRegister,
    addCustomer,
    getOrders,
    getProfile,
    updateAccount,
    getLogout
}