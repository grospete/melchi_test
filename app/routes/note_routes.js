module.exports = function(app, db) {
    var ObjectID = require('mongodb').ObjectId;
    var cookieParser = require('cookie-parser');
    app.use(cookieParser());
    
    const authCookie = {
        auth: 'e54ee7e285fbb0275279143abc4c554e5314e7b417ecac83a5984a964facbaad68866a2841c3e83ddf125a2985566261c4014f9f960ec60253aebcda9513a9b4'
    }

    app.post('/notes', (req, res) => {
        const note = {
            image: req.body.image,
            kategorie: req.body.kategorie,
            beschreibung: req.body.beschreibung,
            lat_coord: req.body.lat_coord,
            lng_coord: req.body.lng_coord,
            nachname: req.body.nachname,
            vorname: req.body.vorname,
            email: req.body.email
        };
        db.collection('incidents').insertOne(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'Internal MongoDB error.' });
            } else {
                res.send(result);
            }
        });
    });
    app.get('/notes/', (req, res) => {
        db.collection('incidents').find({}).toArray(function(err, result){
            if (err) {
                res.send({'error':'Reading Incidents from database failed.'});
            } else {
                res.send(result);
            }
        });
    });
    app.get('/notes/:id', (req, res) => {
        const id = req.params.id.trim();
        const details = { '_id': new ObjectID(id) };
        db.collection('incidents').findOne(details, (err, result) => {
            if (err) {
                res.send({'error':'Incident was not found.'});
            } else {
                res.send(result);
            }
        });
    });
    app.delete('/notes/:id', (req, res) => {
        var reqCookie = req.cookie('userAuthenticator');
        if (reqCookie == authCookie){
            const id = req.params.id.trim();
            const details = { '_id': new ObjectID(id) };
            db.collection('incidents').deleteOne(details, (err, item) => {
                if (err) {
                    res.send({'error':'Could not delete incident.'});
                } else {
                        res.send('Note ' + id + ' deleted!');
                }
            });
        } else {
            res.send('No permission');
        }
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
                res.send({'error':'Update failed.'});
            } else {
                res.send('Note ' + id + ' updated!');
            }
        });
    });

    
    app.post('/login', (req, res) => {
        const user = {
            user: req.body.user,
            passwort: req.body.password
        };
        db.collection('users').find(user).toArray(function (err, result){
            if (err) {
                res.send({'error':'Internal MongoDB error.'});
            } else {
                if (Object.keys(result).length === 0){
                    res.send({'error':'Wrong user or password.'});
                } else {
                    res.cookie('userAuthenticator', authCookie);
                    res.send({'success':'1'});
                }
            }
        });
    });
    app.get('/logout', (req, res)=>{
        res.clearCookie('userAuthenticator');
        res.send('user logout successfully');
    });
};