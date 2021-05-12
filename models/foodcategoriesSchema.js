const mongoose = require('../controllers/databaseController.js')
const Schema = mongoose.Schema

const foodCategoriesSchema = new Schema(
    {
        category: {type: String, required: true},
        icon: {type: String, required: true}
    }
)

module.exports = mongoose.model('foodcategories', foodCategoriesSchema)