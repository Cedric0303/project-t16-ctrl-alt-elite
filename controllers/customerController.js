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

// return default customer homescreen
const getCustomerHome = async (req, res) => {
    const vans = await db.db.collection('vendor').find({}).project({
        "_id": false,
        "password": false
    }).toArray()
    res.render('home', {
        "vans": vans,
        layout: 'home_main'})
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
        res.render('menu', {
            "dist":dist,
            "menu":menu, // passing menu array as "menu"
            "menucat":menucategories, // passing menu categories array as "menucat""
            "van":vendorinfo, // passing selected vendor info json object as "van"
            layout: 'vanselectedsearchcart'})
    } else {
        res.send('<h1> Error getting vendor/menu info </h1>')
    }
}

const postNewOrder = async (req, res) => {
    if (loggedIn(req)) {
        var order = {}
        orderInfo = JSON.parse(req.body.payload);
        // orderInfo structure
        // orderInfo = {
        //   payload: '{
        //      "item":[{
        //          "name":str,
        //          "price":float,
        //          "count":int,
        //          "total":float
        //      }], 
        //      "vendorID":str
        //   }'
        // }

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
        order = {
            item: orderInfo["item"],
            orderTotal: orderTotal,
            timestamp: new Date(),
            vendorID: orderInfo["vendorID"],
            customerID: payload.body.username,
            customerGivenName: payload.body.nameGiven,
            orderStatus: "Ordering",
            orderID: orderID
        };
        await db.db.collection('order').insertOne(order);
        res.redirect('/customer/orders/' + orderID)
    } else {
        res.render('notloggedin');
    }
}

// return individual order page
const getOrderDetail = async (req, res) => {
    const order = await db.db.collection('order').findOne({
        orderID: parseInt(req.params.orderID)
    })
    res.send(JSON.stringify(order))
}

// return order modification page
const getModifyPage = async (req, res) => {
    if (loggedIn(req)) {
        res.send('modify order page')
    }
    else {
        res.render('notloggedin')
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
        res.render('notloggedin')
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
        res.render('notloggedin')
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
    res.render('login')
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
                // if account exists and pw is correct
                // await db.db.collection('customer').findOneAndUpdate({
                //     loginID: user.loginID
                // }, { 
                //     $set:{
                //         sessionID : req.sessionID,
                //         // expiryDate : new Date(Date.now() + hour)
                //     }
                // })
                const body = {username: email, nameGiven: user.nameGiven};
                const token = jwt.sign({body}, process.env.SECRET_OR_PUBLIC_KEY);
                res.cookie("jwt", token, {httpOnly: false, sameSite:false, secure: true})
                // res.session.maxAge = new Date(Date.now() + hour);
                // res.session.cookie.maxAge = hour;
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

const getRegister = async (req, res) => {
    res.render('register')
}

const addCustomer = async (req, res) => {
    // if email does not exist in database, then add an account, if not render dupe account handlebar
    const user = await db.db.collection('customer').findOne({loginID: req.body.email});
    if (user == null) {
        const hash_pw = await bcrypt.hash(req.body.password, parseInt(process.env.SALT))
        await db.db.collection('customer').insertOne({
            nameGiven: req.body.firstName,
            nameFamily: req.body.lastName,
            loginID: req.body.email,
            password: hash_pw
        })
        res.render('loginnewacc');
    } else {
        res.render('registeremaildupe');
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
            res.render('orders', {
                "orders": orders, // passing orders from db into orders.hbs as orders
                layout: 'orderspage'
            })
        } else {
            res.send("ERROR")
        }
    } else {
        res.render('notloggedin');
    }
}

const getProfile = async (req, res) => {
    if (loggedIn(req)) {
        const token = get_cookies(req)['jwt']
        const payload = jwt.decode(token)
        const email = payload.body.username
        const user = await db.db.collection('customer').findOne({loginID: email},{
            "projection": {
                "_id": false,
                "password": false
            }
        });
        res.render('profile', {
            "user": user
        })
    } else {
        res.render('notloggedin');
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
        res.render('notloggedin');
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