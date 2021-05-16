const mongoose = require('../controllers/databaseController.js')
const db = mongoose.connection

const vendorController = require('../controllers/vendorController')

const Vendor = require('../models/vendorSchema')

describe("Unit testing getVendorHome from vendorController.js", () => {
    const req = {}
    const res = {
        render: jest.fn(),
    }
    beforeAll(() => {
        res.render.mockClear()
        vendorController.getVendorHome(req, res)
    })
    test("Test getVendorHome()", () => {
            expect(res.render).toHaveBeenCalledTimes(1);
            expect(res.render).toHaveBeenCalledWith('vendor/login', {layout: 'vendor/main'})
        })
})