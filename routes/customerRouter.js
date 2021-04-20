const express = require('express')

// add our router
const customerRouter = express.Router()

// add the customer controller
const customerController = require('../controllers/customerController.js')

customerRouter.get('/', customerController.getCustomerHome)

customerRouter.get('/menu', customerController.getMenu)

customerRouter.get('/menu/:name', customerController.getFoodDetails)

customerRouter.post('/menu/:name', customerController.addFoodToOrder)

module.exports = customerRouter