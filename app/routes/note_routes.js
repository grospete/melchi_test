module.exports = function(app, db) {
    var ObjectID = require('mongodb').ObjectId;
    app.post('/notes', (req, res) => {
        const note = {
            typ: req.body.typ,
            beschreibung: req.body.beschreibung,
            ort: req.body.ort,
            uhrzeit: req.body.uhrzeit
        };
        db.collection('incidents').insertOne(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result);
            }
        });
        //db.collection('incidents').insertOne(note);
    });
    app.get('/notes/:id', (req, res) => {
        const id = req.params.id.trim();
        console.log(id);
        const details = { '_id': new ObjectID(id) };
        db.collection('incidents').findOne(details, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(result);
            }
        });
    });
    app.delete('/notes/:id', (req, res) => {
        const id = req.params.id.trim();
        const details = { '_id': new ObjectID(id) };
        db.collection('incidents').deleteOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('Note ' + id + ' deleted!');
            }
        });
    });
    app.put('/notes/:id', (req, res) => {
        const id = req.params.id.trim();
        db.collection('incidents').updateOne({
            _id: new ObjectID(id)
        }, {
            $set: {
                beschreibung: req.body.beschreibung
            }
        }, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('Note ' + id + ' updated!');
            }
        });
    });
};