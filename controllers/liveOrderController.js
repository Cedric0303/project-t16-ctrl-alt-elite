require('dotenv').config()
const socket = require('socket.io')
const db = require('../controllers/databaseController.js')

const orderSchema = require('../models/orderSchema.js')
const Order = db.collection('order')

function listenSocket(server) {
    io = socket(server)
    io.on('connection', function(socket) {
        var orderID = null
        console.log(`Socket ${socket.id} connected`)
        
        socket.on('orderID', function (id) {
            orderID = id
            // console.log(orderID)
            const filter = [{
                $match: {
                    'fullDocument.orderID': parseInt(orderID)
                }
            }]
            const options = { fullDocument: 'updateLookup' }
            const changeStream = Order.watch(filter, options)
            changeStream.on('change', (change) => {
                // console.log(change.fullDocument.orderStatus)
                socket.emit('statusChange', change.fullDocument.orderStatus)
            })
        })
    })
} 


module.exports = {
    listenSocket
}