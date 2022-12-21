const express           = require('express');
const { MongoClient }   = require('mongodb');
const bodyParser        = require('body-parser');
const app               = express();
const port              = 8000;
const db                = require('./config/db');
const client            = new MongoClient(db.url);

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });


client.connect((err, database) => {
    if (err) {
        return console.log(err)
    }
    database = database.db("incidents");
    require('./app/routes')(app, database);
});



app.listen(port, () => {
    console.log('We are live on ' + port);
});