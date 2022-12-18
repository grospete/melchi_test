const express           = require('express');
const { MongoClient }   = require('mongodb');
const bodyParser        = require('body-parser');
const app               = express();
const port              = 8000;
const db                = require('./config/db');
const client            = new MongoClient(db.url);

app.use(bodyParser.urlencoded({ extended: true }));

//client.connect(db.url, (err, database) => {  if (err) return console.log(err) });


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