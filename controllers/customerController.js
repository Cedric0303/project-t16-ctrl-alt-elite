require('dotenv').config()
const mongoose = require('mongoose')

// connect to database

CONNECTION_STRING = "mongodb+srv://<username>:<password>@ctrl-alt-elite.ys2d9.mongodb.net/database?retryWrites=true&w=majority"
CONNECTION_STRING = CONNECTION_STRING.replace("<username>",process.env.MONGO_USERNAME).replace("<password>",process.env.MONGO_PASSWORD)

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


const getCustomerHome = async (req, res) => {
    res.send('<h1> Customer Home screen </h1>')
}

const getMenu = async (req, res) => {
    const result = await db.db.collection('food').find({}).project({ "_id": false }).toArray()
    if (result) {
        res.send(result) 
    }
    else {
        res.send("ERROR")
    }
}

const getFoodDetails = async (req, res) => {
    const result = await db.db.collection('food').findOne({name: req.params.name}, { projection: {"_id": false}})
    .catch(e => console.err(e))
    res.send(result)
}

const addFoodToOrder = async (req, res) => {
    const food = await db.db.collection('food').findOne({name: req.params.name})
    const customer = await db.db.collection('customer').findOne({loginID: req.body.loginID})
    await db.db.collection('order').insertOne({
        item: [{foodID: food.foodID, name: food.name, count: req.body.count}], 
        timestamp: new Date(),
        vendorID: req.body.vendorID, 
        customerID: customer.loginID, 
        customerGivenName: customer.nameGiven,
        orderStatus: "Ordering",
        orderID: Math.floor((Math.random() * 1000000) + 1)
    })
    console.log(await db.db.collection('order').find({}).toArray())
    res.send(`<h1> Added ${food.name} to order. </h1>`)
}

module.exports = {
    getCustomerHome, 
    getMenu, 
    getFoodDetails, 
    addFoodToOrder
}