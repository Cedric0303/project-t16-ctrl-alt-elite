const express = require('express')

const customerRouter = express.Router()

// add the customer controller
const customerController = require('../controllers/customerController.js')

customerRouter.get('/', customerController.getCustomerHome)

customerRouter.get('/menu', customerController.getMenu)

customerRouter.get('/menu/:id', customerController.getFoodDetails)

customerRouter.post('/menu/:id', customerController.addFoodToOrder)

module.exports = customerRouter