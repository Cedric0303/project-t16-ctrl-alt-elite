// stubs for Snacks in a Van routes
const express = require('express')
const customerRouter = require('./routes/customerRouter')
const vendorRouter = require('./routes/vendorRouter')
const bodyParser = require('body-parser');
const session = require('express-session');
const exphbs = require('express-handlebars')

const app = express();
const port = process.env.PORT || 8080

app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	secret:	process.env.SECRET_KEY,
	resave: true,
	saveUninitialized: true
}));

app.engine('hbs', exphbs({
	defaultLayout: 'main',
	extname: 'hbs',
	helpers: require(__dirname + "/public/js/helpers.js").helpers
}))

app.set('view engine', 'hbs')

// customer routes
app.use('/customer', customerRouter)

// vendor routes
app.use('/vendor', vendorRouter)

// project homescreen
app.get('/', (req, res) => {
	res.status(200)
	res.write('<h1>Ctrl-ALT-ELITE Project Home screen</h1>')
	res.write('<p><a href="/customer">Customer app</a></p>')
	res.end('<p><a href="/vendor">Vendor app</a></p>')
})

// invalid routes
app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).send('<p>invalid request</p>')
})

// start server
app.listen(port, () => {
	console.log('Snacks in a Van server is listening for requests ...')
})

