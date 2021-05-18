const express = require('express')

// add our router
const customerRouter = express.Router()

// add the customer controller
const customerController = require('../controllers/customerController.js')

// return default customer homescreen
customerRouter.get('/', customerController.getCustomerHome)

// return customer homescreen with pre-selected van 
customerRouter.get('/van/:vanId', customerController.getCustomerHomeVan)

// get food items from the database and return it
customerRouter.get('/menu', customerController.getMenu)

// return information for a given food item
customerRouter.get('/menu/:name', customerController.getFoodDetails)

// create a new order and add a specified food into the order
customerRouter.post('/menu/:name', customerController.addFoodToOrder)

// get food items from the database and also information of selected van
customerRouter.get('/:vanId/menu', customerController.getMenuVan)

// create a new order
customerRouter.post('/:vanId/menu', customerController.postNewOrder)

// login page
customerRouter.get('/login', customerController.getLogin)

// user attemps login
customerRouter.post('/auth', customerController.authLogin)

// register page
customerRouter.get('/register', customerController.getRegister)

// user makes new account
customerRouter.post('/register', customerController.addCustomer)

// get orders page
customerRouter.get('/orders', customerController.getOrders)

// get specific order page (live status or for completed orders, a detailed view of the order)
customerRouter.get('/orders/:orderID', customerController.getOrderDetail)

// get order modification page
customerRouter.get('/orders/:orderID/modify', customerController.getModifyPage)

// submit modified order into database
customerRouter.get('/orders/:orderID/reorder', customerController.modifyOrder)

// remove order from database
customerRouter.get('/orders/:orderID/cancel', customerController.cancelOrder)

// get current status of user's order
customerRouter.get('/orders/:orderID/status', customerController.getOrderStatus)

// get live order status from the DB
customerRouter.get('/orders/:orderID/status/live', customerController.updateOrderStatus)

// user adds review to order
customerRouter.post('orders/:orderID/review', customerController.postReview)

// profile page
customerRouter.get('/profile', customerController.getProfile)

// user updates account
customerRouter.post('/profile', customerController.updateAccount)

// logout action
customerRouter.get('/logout', customerController.getLogout)


module.exports = customerRouter