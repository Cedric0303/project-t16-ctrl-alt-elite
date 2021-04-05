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


const getVendorHome = (req, res) => {
    res.send('<h1> Vendor Home screen </h1>')
}

const postVendor = async (req, res) => {
    // marks van as ready-for-orders
    // need to implement some way to prevent van status from being changed before login details are entered 
    const vendorName =  await db.db.collection('vendor').findOne({loginID: req.params.id})
    db.db.collection('vendor').updateOne({loginID: req.params.id}, {$set: {isOpen: !(vendorName.isOpen)}})
    res.send("<h1> Set van status </h1>")

}

const getVendor = async (req, res) => {
    const vendorName = await db.db.collection('vendor').findOne({loginID: req.params.id}, { projection: {"_id": false}})
    .catch(e => console.err(e))
    if (vendorName) {
        res.send(vendorName)
    }
    else {
        res.send('<h1> Invalid vendor loginID </h1>')
    }
}

const getOrders = async (req, res) => {
    res.send('<h1> Get list of outstanding orders </h1>')
}

const fulfilledOrder = async (req, res) => {
    res.send("<h1> Mark an order as 'fulfilled' </h1>")
}

module.exports = {
    getVendorHome, 
    postVendor, 
    getVendor, 
    getOrders, 
    fulfilledOrder
}