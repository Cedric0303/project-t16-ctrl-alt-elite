const express = require('express')

// add our router 
const vendorRouter = express.Router()

// add the vendor controller
const vendorController = require('../controllers/vendorController.js')

vendorRouter.get('/', vendorController.getVendorHome)

vendorRouter.post('/:id', vendorController.postVendor)

vendorRouter.get('/:id', vendorController.getVendor)

vendorRouter.get('/:id/:orderID', vendorController.getOrders)

vendorRouter.post('/:id/:orderID', vendorController.fulfilledOrder)

module.exports = vendorRouter