const express = require('express')

// add our router 
const vendorRouter = express.Router()

// add the vendor controller
const vendorController = require('../controllers/vendorController.js')

// return default vendor home screen
vendorRouter.get('/', vendorController.getVendorHome)

// authenticate vendor login
vendorRouter.post('/login/auth', vendorController.authLogin)

// open van: set van status using location provided
vendorRouter.post('/:vanID/open', vendorController.postVendor)

// return a specific vendor van
vendorRouter.get('/:vanID', vendorController.getVendor)

// close van
vendorRouter.get('/:vanID/close', vendorController.closeVan)

// return orders of a specific vendor van
vendorRouter.get('/:vanID/orders', vendorController.getOrders)

// sets order status of a specific order to fulfilled
vendorRouter.post('/:vanID/orders/fulfill/:orderID', vendorController.fulfilledOrder)

// sets order status of a specific order to completed
vendorRouter.post('/:vanID/orders/complete/:orderID', vendorController.pickedUpOrder)

// get past orders of a van
vendorRouter.get('/:vanID/pastorders', vendorController.getPastOrders)

// logout of a van
vendorRouter.get('/:vanID/logout', vendorController.getLogout)

module.exports = vendorRouter