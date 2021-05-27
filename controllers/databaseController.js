require('dotenv').config()
const mongoose = require('mongoose')

// connect to database
CONNECTION_STRING = "mongodb+srv://<username>:<password>@ctrl-alt-elite.ys2d9.mongodb.net/database?retryWrites=true&w=majority"
CONNECTION_STRING = CONNECTION_STRING.replace("<username>", process.env.MONGO_USERNAME).replace("<password>", process.env.MONGO_PASSWORD)

mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    })
    
const db = mongoose.connection
db.on('error', function (err) {
    console.log('Failed to connect to database');
    process.exit(1);
    });
db.once('open', function () {
    console.log("Connected to database");
});

module.exports = db
