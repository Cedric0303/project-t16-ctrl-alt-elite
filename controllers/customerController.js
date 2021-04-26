require('dotenv').config()
const mongoose = require('mongoose')
const path = require('path')

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

// return default customer homescreen
const getCustomerHome = async (req, res) => {
    res.send('<h1> Customer Home screen </h1>')
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
            foodID: food._ID,
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
    res.sendFile(path.join(__dirname, '..', 'html', 'customer', 'login.html'));
}

const getLoginError = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'customer', 'loginerror.html'));
}

const authLogin = async (req, res) => {
    const email = req.body.email
    const pw = req.body.password
    if (email && pw) {
        const user = await db.db.collection('customer').findOne({
            loginID: email,
            password: pw
        })
        if (user) {
            req.session.loggedin = true;
            req.session.username = email;
            res.redirect('/customer/menu/');
        }
        else {
            res.redirect('/customer/loginerror')
        }
        res.end();
    }
    else {
        res.send('Please enter Username and Password!');
		res.end();
    }
}

const getRegister = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'customer', 'register.html'));
}

const addCustomer = async (req, res) => {
    await db.db.collection('customer').insertOne({
        nameGiven: req.body.firstName,
        nameFamily: req.body.lastName,
        loginID: req.body.email,
        password: req.body.password
    })
    res.redirect('/customer/menu');
}

module.exports = {
    getCustomerHome,
    getMenu,
    getFoodDetails,
    addFoodToOrder,
    getLogin,
    getLoginError,
    authLogin,
    getRegister,
    addCustomer
}