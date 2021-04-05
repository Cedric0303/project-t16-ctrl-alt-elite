// stubs for Snacks in a Van routes
const express = require('express')
const customerRouter = require('./routes/customerRouter')
const vendorRouter = require('./routes/vendorRouter')

const app = express();
const port = process.env.PORT || 8080

app.use(express.json())

// CUSTOMER ROUTES
app.use('/customer', customerRouter)

// VENDOR ROUTES
app.use('/vendor', vendorRouter)


app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).send('<p>invalid request</p>')
})

app.listen(port, () => {
	console.log('Snacks in a Van server is listening for requests ...')
})

