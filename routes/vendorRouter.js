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
vendorRouter.post('/:id/open', vendorController.postVendor)

// return a specific vendor van
vendorRouter.get('/:id', vendorController.getVendor)

vendorRouter.get('/:id/close', vendorController.closeVan)

// return orders of a specific vendor van
vendorRouter.get('/:id/orders', vendorController.getOrders)

// sets a specific order as fulfilled
vendorRouter.post('/:id/orders/fulfill/:orderID', vendorController.fulfilledOrder)

vendorRouter.post('/:id/orders/complete/:orderID', vendorController.pickedUpOrder)

vendorRouter.get('/:id/pastorders', vendorController.getPastOrders)

vendorRouter.get('/:id/logout', vendorController.getLogout)

module.exports = vendorRouter