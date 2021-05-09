const express = require('express')

// add our router
const customerRouter = express.Router()

// add the customer controller
const customerController = require('../controllers/customerController.js')

// return default customer homescreen
customerRouter.get('/', customerController.getCustomerHome)

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

customerRouter.get('/login', customerController.getLogin)

customerRouter.post('/auth', customerController.authLogin)

customerRouter.get('/register', customerController.getRegister)

customerRouter.post('/register', customerController.addCustomer)

customerRouter.get('/orders', customerController.getOrders)

customerRouter.get('/orders/:orderID', customerController.getOrderDetail)

customerRouter.get('orders/:orderID/review', customerController.updateOrderStatus)

customerRouter.post('orders/:orderID/review', customerController.postReview)

customerRouter.get('/profile', customerController.getProfile)

customerRouter.get('/logout', customerController.getLogout)


module.exports = customerRouter