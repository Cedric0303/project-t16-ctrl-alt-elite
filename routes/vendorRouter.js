const express = require('express')

// add our router 
const vendorRouter = express.Router()

// add the vendor controller
const vendorController = require('../controllers/vendorController.js')

// return default vendor home screen
vendorRouter.get('/', vendorController.getVendorHome)

// set van status using location provided
// vendorRouter.post('/:id', vendorController.postVendor)

// return a specific vendor van
vendorRouter.get('/:id', vendorController.getVendor)

// authenticate vendor login
vendorRouter.post('/auth', vendorController.authLogin)

// return orders of a specific vendor van
vendorRouter.get('/:id/orders', vendorController.getOrders)

// sets a specific order as fulfilled
vendorRouter.post('/:id/orders/:orderID', vendorController.fulfilledOrder)

vendorRouter.get('/logout', vendorController.getLogout)

module.exports = vendorRouter