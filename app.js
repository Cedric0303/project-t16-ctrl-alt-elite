// stubs for Snacks in a Van routes
const express = require('express')
const mongoose = require('mongoose')
const app = express();

// connect to database

// 			"change <username> / <password> to your database access username & password"
const uri = "mongodb+srv://<username>:<password>@ctrl-alt-elite.ys2d9.mongodb.net/database?retryWrites=true&w=majority"

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then (() => {
	console.log('MongoDB Connected...')
}
)
.catch(err => console.log(err))

// CUSTOMER ROUTES

app.get('/customer', (req, res) => {
	res.send('<h1> Customer Home screen </h1>')
})

app.get('/customer/menu', (req, res) => {
	res.send('<h1> Ordering/Menu Screen </h1>')
})

app.get('/customer/menu/:id', (req, res) => {
	res.send('<h1> View details of a snack </h1>')
})

app.post('/customer/menu/:id', (req, res) => {
	res.send('<h1> Customer starts a new order by requesting a snack </h1>')
})

// VENDOR ROUTES

app.get('/vendor', (req, res) => {
	res.send('<h1> Vendor Home screen </h1>')
})

app.post('/vendor/:id', (req, res) => {
	res.send("<h1> Setting van status </h1>")
})

app.post('/vendor/orders/:id', (req, res) => {
	res.send("<h1> Mark an order as 'fulfilled' </h1>")
})

app.get('/vendor/orders', (req, res) => {
	res.send('<h1> List of outstanding orders </h1>')
})

app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).send('<p>invalid request</p>')
})

app.listen(8080, () => {
	console.log('Snacks in a Van server is listening for requests ...')
})

