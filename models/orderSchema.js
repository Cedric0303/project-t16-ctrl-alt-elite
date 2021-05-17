const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema(
    {
        item: [{
            name: {type: String, required: true},
            price: {type: Number, required: true},
            count: {type: Number, required: true},
            total: {type: Number, required: true}
        }],
        orderTotal: {type: Number, required: true},
        timestamp: {type: Date, required: true},
        vendorID: {type: String, required: true},
        customerID: {type: String, required: true},
        customerGivenName: {type: String, required: true},
        orderStatus: {type: String, required: true},
        orderID: {type: Number, required: true},
        fulfilledTimestamp: {type: Date},
        completedTimestamp: {type: Date}
    }
)

module.exports = mongoose.model('order', orderSchema)