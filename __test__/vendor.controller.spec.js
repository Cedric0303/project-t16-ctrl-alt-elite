const mongoose = require('../controllers/databaseController.js')
const db = mongoose.connection

const vendorController = require('../controllers/vendorController')

const Vendor = require('../models/vendorSchema')

describe("Unit testing postVendor from vendorController.js", () => {
    const req = {}
    const res = {
        render: jest.fn(),
    }
    beforeAll(() => {
        res.render.mockClear()
        vendorController.getVendorHome(req, res)
    })
    test("Test case 1: GET vendor home/login page", () => {
            expect(res.render).toHaveBeenCalledTimes(1);
            expect(res.render).toHaveBeenCalledWith('vendor/login', {layout: 'vendor/main'})
        })
})