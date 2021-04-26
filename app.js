// stubs for Snacks in a Van routes
const express = require('express')
const customerRouter = require('./routes/customerRouter')
const vendorRouter = require('./routes/vendorRouter')

const app = express();
const port = process.env.PORT || 8080

app.use(express.json())
app.use(express.static('public'))

// customer routes
app.use('/customer', customerRouter)

// vendor routes
app.use('/vendor', vendorRouter)

// project homescreen
app.get('/', (req, res) => {
	res.send('<h1>Ctrl-ALT-ELITE Project Home screen</h1>')
})

// invalid routes
app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).send('<p>invalid request</p>')
})

// start server
app.listen(port, () => {
	console.log('Snacks in a Van server is listening for requests ...')
})

