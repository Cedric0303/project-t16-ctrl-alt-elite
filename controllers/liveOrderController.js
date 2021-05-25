require('dotenv').config()
const socket = require('socket.io')
const db = require('../controllers/databaseController.js')

const orderSchema = require('../models/orderSchema.js')
const Order = db.collection('order')

async function listenSocket(server) {
    io = socket(server)

    io.on('connection', function(socket) {
        console.log(`Socket ${socket.id} connected`)

        socket.on('orderID', function (id) {
            orderID = id
            const filter = [{
                $match: {
                    'fullDocument.orderID': parseInt(orderID)
                }
            }]
            const options = { fullDocument: 'updateLookup' }
            const changeStream = Order.watch(filter, options)
            changeStream.on('change', (change) => {
                socket.emit('statusChange', change.fullDocument.orderStatus)
            })
        })

        socket.on('vanID', function (id) {
            console.log(id)
            vanID = id
            const filter = [{
                $match: {
                    'fullDocument.vendorID': vanID,
                    'fullDocument.orderStatus': {
                        $in: ['Ordering', 'Fulfilled', 'Completed']
                    }
                }
            }]
            const options = { fullDocument: 'updateLookup' }
            const changeStream = Order.watch(filter, options)
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