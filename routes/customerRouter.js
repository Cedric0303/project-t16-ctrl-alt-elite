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

customerRouter.get('/login', customerController.getLogin)

customerRouter.get('/loginerror', customerController.getLoginError)

customerRouter.post('/auth', customerController.authLogin)

customerRouter.get('/register', customerController.getRegister)

customerRouter.post('/register', customerController.addCustomer)

module.exports = customerRouter