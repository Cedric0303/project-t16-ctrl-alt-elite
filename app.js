// stubs for Snacks in a Van routes
const express = require('express')
const customerRouter = require('./routes/customerRouter')
const vendorRouter = require('./routes/vendorRouter')

const app = express();
const port = process.env.PORT || 8080

app.use(express.json())

// customer routes
app.use('/customer', customerRouter)

// customer routes
app.use('/vendor', vendorRouter)

// invalid routes
app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).send('<p>invalid request</p>')
})

// start server
app.listen(port, () => {
	console.log('Snacks in a Van server is listening for requests ...')
})

