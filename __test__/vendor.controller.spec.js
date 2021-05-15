const mongoose = require('../controllers/databaseController.js')
const db = mongoose.connection

const vendorController = require('../controllers/vendorController')

const Vendor = require('../models/vendorSchema')

describe("Unit testing postVendor from vendorController.js", () => {
    const req = {
        params: {
            id: 'Diner_Driver',
            address: '169 Rathdowne St',
            latitude: -37.802852,
            longitude: 144.969487
        },
        // body: {
        //     vanID: 'Diner_Driver',
        //     password: '12345678'
        // }
    }
    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
    }
    beforeAll(() => {
        res.render.mockClear()
        res.redirect.mockClear()
        Vendor.findOne = jest.fn().mockResolvedValue([{
            _id: '608eb9f665d410847c959d5b',
            loginID: 'Diner_Driver',
            password: '$2b$10$Sa8ejHa5Q73KfUj9t/k9uO6K5Djwvb.VdvRUKJm6/QfPWV2cPcTla',
            isOpen: true,
            address: '169 Rathdowne St',
            latitude: -37.802852,
            longitude: 144.969487,
            vanName: 'Diner Driver'
        }])
        Vendor.findOneAndUpdate = jest.fn().mockResolvedValue([{
            _id: '608eb9f665d410847c959d5b',
            loginID: 'Diner_Driver',
            password: '$2b$10$Sa8ejHa5Q73KfUj9t/k9uO6K5Djwvb.VdvRUKJm6/QfPWV2cPcTla',
            isOpen: true,
            address: '169 Rathdowne St',
            latitude: -37.802852,
            longitude: 144.969487,
            vanName: 'Diner Driver'
        }])
        // vendorController.authLogin(req, res)
        vendorController.postVendor(req, res)
    })
    test("Test case 1: testing with existing van id \
        Diner_Driver, expecting update to van status", () => {
            expect(res.render).toHaveBeenCalledTimes(1);
            // expect(res.redirect).toHaveBeenCalledTimes(1);
            expect(res.render).toHaveBeenCalledWith('vendor/orders', {
                layout: 'vendor/main'})
        })
})