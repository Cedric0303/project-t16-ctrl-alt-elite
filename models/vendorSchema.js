const mongoose = require('../controllers/databaseController.js')
const Schema = mongoose.Schema

const vendorSchema = new Schema(
    {
        loginID: {type: String, required: true},
        password: {type: String, required: true},
        isOpen: {type: Boolean, required: true},
        address: {type: String, required: true},
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        vanName: {type: String, required: true}
    }
)

module.exports = mongoose.model('vendor', vendorSchema)