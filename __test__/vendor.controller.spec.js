const mongoose = require('../controllers/databaseController.js')
const db = mongoose.connection
// const jest = require('jest')

const vendorController = require('../controllers/vendorController')
const vendorToken = require('../controllers/vendorToken')

const Vendor = require('../models/vendorSchema')

describe('#1 Unit testing getVendorHome', () => {
    const req = {}
    const res = {
        render: jest.fn()
    }
    beforeAll(() => {
        res.render.mockClear()
    })
    test("Test getVendorHome()", async () => {
        vendorController.getVendorHome(req, res)
        expect(res.render).toHaveBeenCalledTimes(1)
        expect(res.render).toHaveBeenCalledWith('vendor/login', {layout: 'vendor/main'})
    })
})

describe("#2 Unit testing postVendor (logged in)", () => {
    const req = {
        params: {
            vanID: 'Diner_Driver'
        },
        body: {
            address: '169 Rathdowne St',
            latitude: -37.802852,
            longitude: 144.969487
        }
    }
    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnValue(400),
    }
    beforeAll (() => {
        res.render.mockClear()
        res.redirect.mockClear()
        res.status.mockClear()
        vendorToken.loggedIn = jest.fn(x => true)
        Vendor.updateOne = jest.fn().mockResolvedValue({
            "acknowledged" : true, 
            "matchedCount" : 1, 
            "modifiedCount" : 1
        })
    })
    test("Test postVendor() (logged in)", async () => {
        await vendorController.postVendor(req, res)
        expect(res.render).toHaveBeenCalledTimes(0);
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith('/vendor/' + req.params.vanID + '/orders')
    })
})

describe("#3 Unit testing postVendor (not logged in)", () => {
    const req = {
        params: {
            vanID: 'Diner_Driver'
        },
        body: {
            address: '169 Rathdowne St',
            latitude: -37.802852,
            longitude: 144.969487
        }
    }
    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn()
    }
    beforeAll(() => {
        res.render.mockClear()
        res.redirect.mockClear()
        res.status.mockClear()
        vendorToken.loggedIn = jest.fn(x => false)
        Vendor.updateOne = jest.fn().mockResolvedValue({
            "acknowledged" : true, 
            "matchedCount" : 1, 
            "modifiedCount" : 1
        })
    })

    test("Test postVendor() (not logged in)", async () => {
        await vendorController.postVendor(req, res)
        expect(res.redirect).toHaveBeenCalledTimes(0);
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(402)
        expect(res.render).toHaveBeenCalledWith('vendor/notloggedin', {layout: 'vendor/main'})
    })
})