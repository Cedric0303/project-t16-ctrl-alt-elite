const mongoose = require('mongoose')

// connect to database

const uri = "mongodb+srv://defaultuser:defaultuser@ctrl-alt-elite.ys2d9.mongodb.net/database?retryWrites=true&w=majority"

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then (() => {
	console.log('MongoDB Connected...')
})
.catch(err => console.log(err))

const connection = mongoose.connection

const getCustomerHome = async (req, res) => {
    res.send('<h1> Customer Home screen </h1>')
}

const getMenu = async (req, res) => {
    const foods = await connection.db.collection('food').find({}).toArray()
    if (foods) {
        res.send(foods)
    }
    else {
        res.send("ERROR")
    }
}

const getFoodDetails = async (req, res) => {
    res.send('<h1> View details of a snack </h1>')
}

const addFoodToOrder = async (req, res) => {
    res.send('<h1> Customer starts a new order by requesting a snack </h1>')
}

module.exports = {
    getCustomerHome, 
    getMenu, 
    getFoodDetails, 
    addFoodToOrder
}