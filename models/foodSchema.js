const mongoose = require('../controllers/databaseController.js')
const Schema = mongoose.Schema

const foodSchema = new Schema(
    {
        id: {type: String, required: true},
        name: {type: String, required: true},
        category: {type: String, required: true},
        price: {type: Number, required: true},
        image: {type: String, required: true}
    }
)

module.exports = mongoose.model('food', foodSchema)