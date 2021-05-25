// stubs for Snacks in a Van routes
const express = require('express')
const customerRouter = require('./routes/customerRouter')
const vendorRouter = require('./routes/vendorRouter')
const session = require('express-session');
const exphbs = require('express-handlebars')
const favicon = require('serve-favicon')
const path = require('path')

const liveOrderController = require('./controllers/liveOrderController.js')

const app = express();
const port = process.env.PORT || 8080

app.use(express.json())
app.use(express.static('public'))
app.use('/static', express.static('node_modules'));
app.use(express.urlencoded({extended: false}));
app.use(session({
	secret:	process.env.SECRET_KEY,
	resave: true,
	saveUninitialized: true
}));
app.use(favicon(path.join(__dirname,'public','icons','favicon.ico')));

app.engine('hbs', exphbs({
	defaultLayout: 'default',
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
var server = app.listen(port, () => {
	console.log('Snacks in a Van server is listening for requests')
})

liveOrderController.listenSocket(server)

module.exports = app