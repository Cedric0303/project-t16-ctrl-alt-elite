const mongoose = require('mongoose')

// connect to database

const uri = "mongodb+srv://defaultuser:defaultuser@ctrl-alt-elite.ys2d9.mongodb.net/database?retryWrites=true&w=majority"

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then (() => {
	console.log('MongoDB Connected...')
}
)
.catch(err => console.log(err))

const connection = mongoose.connection;

// const vendors = require('../models/vendor.json')

const getVendorHome = (req, res) => {
    res.send('<h1> Vendor Home screen </h1>')
}

const postVendor = async (req, res) => {
    res.send("<h1> Setting van status </h1>")
}

const getVendor = async (req, res) => {
    const vendorName = await connection.db.collection('vendor').findOne({loginID: req.params.id})
    .catch(e => console.err(e))
    if (vendorName) {
        res.send(vendorName.loginID)
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
    getVendorHome, postVendor, getVendor, getOrders, fulfilledOrder
}