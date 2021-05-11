const express = require('express')

// add our router 
const vendorRouter = express.Router()

// add the vendor controller
const vendorController = require('../controllers/vendorController.js')

// return default vendor home screen
vendorRouter.get('/', vendorController.getVendorHome)

// authenticate vendor login
vendorRouter.post('/login/auth', vendorController.authLogin)

// set van status using location provided
vendorRouter.post('/:id', vendorController.postVendor)

// return a specific vendor van
vendorRouter.get('/:id', vendorController.getVendor)

// return orders of a specific vendor van
vendorRouter.get('/:id/orders', vendorController.getOrders)

// sets a specific order as fulfilled
vendorRouter.post('/:id/orders/:orderID', vendorController.fulfilledOrder)

vendorRouter.get('/logout', vendorController.getLogout)

module.exports = vendorRouter