require('dotenv').config()
const socket = require('socket.io')
const db = require('../controllers/databaseController.js')

const orderSchema = require('../models/orderSchema.js')
const Order = db.collection('order')

async function listenSocket(server) {
    io = socket(server)

    io.on('connection', function(socket) {
        
        // customer individual live order
        socket.on('orderID', function (id) {
            orderID = id
            const filter = [{
                $match: {
                    'fullDocument.orderID': parseInt(orderID),
                    'fullDocument.orderStatus': {
                        $in: ['Ordering', 'Fulfilled', 'Completed']
                    }
                }
            }]
            const options = { fullDocument: 'updateLookup' }
            const changeStream = Order.watch(filter, options)
            changeStream.on('change', (change) => {
                socket.emit('statusChange', JSON.stringify(change.fullDocument))
            })
        })

        // customer all live orders
        socket.on('customerID', function (id) {
            customerID = id
            const filter = [{
                $match: {
                    'fullDocument.customerID': customerID,
                }
            }]
            const options = { fullDocument: 'updateLookup' }
            const changeStream = Order.watch(filter, options)
            changeStream.on('change', async () => {
                orders = await Order.find({
                    customerID: customerID,
                }).project({
                    "_id": false,
                    "password": false
                })
                .sort({"timestamp": -1})
                .toArray()
                socket.emit('ordersChange', orders)
            })
        })

        // vendor all live orders
        socket.on('vanID', function (id) {
            vanID = id
            const changeStream = Order.watch()
            changeStream.on('change', async () => {
                orders = await Order.find({
                    vendorID: vanID,
                    orderStatus: {
                        $in: ['Ordering', 'Fulfilled']
                    }
                }).project({
                    "_id": false,
                    "password": false
                }).toArray()
                socket.emit('orderChange', orders)
            })
        })
    })
}

module.exports = {
    listenSocket
}