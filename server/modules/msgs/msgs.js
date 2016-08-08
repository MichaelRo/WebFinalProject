/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

module.exports = function msgsModule(app, db, path, express, mongoDBClient, io) {

    // setup us static middleware to serve static files along with the HTML (such as CSS and JS files)
    app.use(express.static('client/modules/msgs'));

    // handle main GET request and serve landing page
    app.get('/screen=:screenId', function (req, res) {
        // return landing page
        res.sendFile(path.resolve('client/modules/msgs/msgs.html'));
    });


    // handle ajax request to serve appropriate messages using parameter routing
    app.get('/api/msgs', function (req, res) {

        // exit if unauthenticated
        if (req.isUnauthenticated())
        {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        // get all messages from the database
        // retrieve matching messages from the database by screen id
        db.collection('msgs')
            .find()
            .toArray(function (err, docs) {
                // if there is an error, display it
                if (err) {
                    console.log('Unable to fetch messages from db. Error:', err);
                }
                else {
                    // return messages
                    res.json(docs);
                }
            });

    });


    // search
    app.get('/api/msgs/search', function (req, res) {

        // exit if unauthenticated
        if (req.isUnauthenticated())
        {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        var queryType = req.query.queryType;
        var queryString = "";

        if (queryType === "min") {
            // prepare query string
            queryString = "this.textArr.length >= " + req.query.txtFieldsCount + " && " +
                          "this.imageArr.length >= " + req.query.imgFieldsCount + " && " +
                          "this.displayLength >= " + req.query.minDisplayLength;
        }
        else if (queryType === "max") {
            // prepare query string
            queryString = "this.textArr.length <= " + req.query.txtFieldsCount + " || " +
                          "this.imageArr.length <= " + req.query.imgFieldsCount + " || " +
                          "this.displayLength <= " + req.query.minDisplayLength;
        }

        // get all messages from the database
        // retrieve matching messages from the database by screen id
        db.collection('msgs')
            .find({
                $where: queryString
            })
            .toArray(function (err, docs) {
                // if there is an error, display it
                if (err) {
                    console.log('Unable to fetch messages from db. Error:', err);
                }
                else {
                    // return messages
                    res.json(docs);
                }
            });

    });


    // handle ajax request to serve appropriate messages using parameter routing
    app.post('/api/msgs/add', function (req, res) {

        // exit if unauthenticated
        if (req.isUnauthenticated())
        {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        console.log('Adding message : ' + req.body);
        // get all messages from the database
        // retrieve matching messages from the database
        var result = db.collection('msgs')
                       .insertOne(req.body)
                       .then(function (result) {

                           // notify clients they need to update
                           sendRequeryNotification();
                            // success
                            res.status(200).json({inserted: result.insertedCount > 0});

                       }, function (error) {
                            // Common error handling
                            console.log(error);
                            // result
                            res.status(404).json({inserted: false});
                       });
    });

    // handle ajax request to serve appropriate messages using parameter routing
    app.post('/api/msgs/delete', function (req, res) {

        // exit if unauthenticated
        if (req.isUnauthenticated())
        {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        console.log('Deleting message with id : '+  req.body._id);
        // get all messages from the database
        // retrieve matching messages from the database
        var result = db.collection('msgs')
                       .removeOne({ _id: new mongoDBClient.ObjectID(req.body._id) })
                       .then(function (result) {

                           // notify clients they need to update
                           sendRequeryNotification();
                           // success
                           res.status(200).json({deleted: result.deletedCount > 0});

                       }, function (error) {
                            // Common error handling
                            console.log(error);
                           // result
                           res.status(404).json({deleted: false});
                        });
    });

    // handle ajax request to serve appropriate messages using parameter routing
    app.post('/api/msgs/update', function (req, res) {

        // exit if unauthenticated
        if (req.isUnauthenticated())
        {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        console.log('Updating message with id : '+  req.body._id);

        // retrieve matching messages from the database
        var result = db.collection('msgs')
                       .updateOne({ _id: new mongoDBClient.ObjectID(req.body._id) },
                       {
                            name: req.body.name,
                            textArr: req.body.textArr,
                            imageArr: req.body.imageArr,
                            videoPath: req.body.videoPath,
                            screensArr: req.body.screensArr,
                            templateUrl: req.body.templateUrl,
                            displayLength: req.body.displayLength,
                            timeframes: req.body.timeframes
                       },
                       { upsert: false })
                       .then(function (result) {

                           // notify clients they need to update
                           sendRequeryNotification();
                            // success
                            res.status(200).json({updated: result.modifiedCount > 0});

                        }, function (error) {

                            // Common error handling
                            console.log(error);
                            // result
                            res.status(404).json({updated: false});

                        });
    });

    // handle ajax request to serve appropriate messages using parameter routing
    app.get('/api/screen=:screenId', function (req, res) {

        // fetch screen id
        var screenId = parseInt(req.params.screenId);

        // get the current date
        //var date = new Date();

        // FOR DEBUG PORPUSES!!!!!!
        // -----------------------
        var date = new Date(2016, 3, 11, 18, 0, 0, 0);

        // get timestamp
        var timestamp = date.getTime() / 1000;
        // ------------------------

        // retrieve matching messages from the database by screen id
        db.collection('msgs')
            .find({
                    screensArr: screenId,
                    "timeframes.fromDate": {$lte: timestamp},
                    "timeframes.toDate": {$gte: timestamp},
                    "timeframes.fromTime": {$lte: date.getHours()},
                    "timeframes.toTime": {$gte: date.getHours()},
                    "timeframes.daysInWeek": date.getDay()
                }
            )
            .toArray(function (err, docs) {
                // if there is an error, display it
                if (err) {
                    console.log('Unable to fetch messages from db. Error:', err);
                }
                else {

                    // log
                    console.log('Fetching messages for screen %d. fetched total of %d messages.',
                        req.params.screenId, docs.length);

                    // return messages
                    res.json(docs);
                }
            });
    })

    function sendRequeryNotification()
    {
        // indicate to clients that requery is needed
        io.sockets.emit('requeryNeeded', {});
    }
}