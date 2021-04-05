// stubs for Snacks in a Van routes
const express = require('express')

const vendorRouter = require('./routes/vendorRouter')

const app = express();
const port = process.env.PORT || 8080

// CUSTOMER ROUTES

app.get('/customer', (req, res) => {
	res.send('<h1> Customer Home screen </h1>')
})

app.get('/customer/menu', (req, res) => {
	database.db.collection("food", function(err, collection) {
		collection.find({}).toArray(function(err, data) {
			console.log(data)
		})
	})
	res.send('<h1> Ordering/Menu Screen </h1>')
})

app.get('/customer/menu/:id', (req, res) => {
	res.send('<h1> View details of a snack </h1>')
})

app.post('/customer/menu/:id', (req, res) => {
	res.send('<h1> Customer starts a new order by requesting a snack </h1>')
})

// VENDOR ROUTES

app.use('/vendor', vendorRouter)


app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).send('<p>invalid request</p>')
})

app.listen(port, () => {
	console.log('Snacks in a Van server is listening for requests ...')
})

