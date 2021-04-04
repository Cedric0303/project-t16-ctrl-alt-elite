// stubs for Snacks in a Van routes
const express = require('express')
const app = express();

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

app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).send('<p>invalid request</p>')
})

app.listen(8080, () => {
	console.log('Snacks in a Van server is listening for requests ...')
})

