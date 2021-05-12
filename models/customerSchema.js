const mongoose = require('../controllers/databaseController.js')
const Schema = mongoose.Schema

const customerSchema = new Schema(
    {
        nameGiven: {type: String, required: true},
        nameFamily: {type: String, required: true},
        loginID: {type: String, required: true},
        password: {type: String, required: true}
    }
)

module.exports = mongoose.model('customer', customerSchema)