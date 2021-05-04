require('dotenv').config()
const mongoose = require('mongoose')
const path = require('path')
const bcrypt = require('bcrypt')
const salt = 10
const hour = 3600000

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

// return login state
function loggedIn(req) {
    // if an username (email) is bound to session, return true for LOGGED IN
    if (req.session.username != null) {
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
    if (menu && vendorinfo) {
        res.render('menu', {
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
        orderInfo = req.body.payload;
        // example orderInfo content
        // orderInfo = {
        //   payload: '{"item":[{"name":"Cappucino","price":4.5,"count":3,"total":"13.50"},
        //                      {"name":"Long_black","price":4,"count":1,"total":"4.00"}],
        //              "vendorID":"Tasty_Trailer"}'
        // }
        console.log(orderInfo)
        console.log(orderInfo.item)
        console.log(orderInfo.vendorID)
        
        order = {
            item: orderInfo["item"],
            timestamp: new Date(),
            vendorID: orderInfo["vendorID"],
            customerID: req.session.username,
            customerGivenName: req.session.givenname,
            orderStatus: "Ordering",
            orderID: Math.floor((Math.random() * 1000000) + 1)
        };
        console.log(order);
        res.redirect('/customer/orders');
    } else {
        res.render('notloggedin');
    }
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
                await db.db.collection('customer').findOneAndUpdate({
                    loginID: user.loginID
                }, { 
                    $set:{
                        sessionID : req.sessionID,
                        expiryDate : new Date(Date.now() + hour)
                    }
                })
                req.session.username = email;
                req.session.givenname = user.nameGiven;
                req.session.maxAge = new Date(Date.now() + hour);
                req.session.cookie.maxAge = hour;
                // return the user to their previous page
                // https://stackoverflow.com/questions/12442716/res-redirectback-with-parameters
                backURL=req.header('Referer') || '/';
                res.redirect(backURL);
            }
            else {
                // if account did not exist
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
        const hash_pw = await bcrypt.hash(req.body.password, salt)
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
        const orders = await db.db.collection('order').find({
            "customerID": req.session.username
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

module.exports = {
    getCustomerHome,
    getMenu,
    getMenuVan,
    postNewOrder,
    getFoodDetails,
    addFoodToOrder,
    getLogin,
    authLogin,
    getRegister,
    addCustomer,
    getOrders
}