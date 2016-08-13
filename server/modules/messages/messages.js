/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

module.exports = function messagesModule(app, db, path, express, mongoDBClient, io) {
    // Setup us static middleware to serve static files along with the HTML (such as CSS and JS files)
    app.use(express.static('client/modules/messages'));

    // Handle main GET request
    app.get('/screen=:screenId', function (req, res) {
        res.sendFile(path.resolve('client/modules/messages/messages.html'));
    });

    // Handle ajax request to serve appropriate messages using parameter routing
    app.get('/api/messages', function (req, res) {
        // Exit if unauthenticated
        if (req.isUnauthenticated()) {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        // Get all messages from the database
        db.collection('messages')
            .find()
            .toArray(function (err, docs) {
                if (err) {
                    console.log('Unable to fetch messages from db. Error:', err);
                }
                else {
                    // return messages
                    res.json(docs);
                }
            });

    });

    app.get('/api/messages/search', function (req, res) {
        // Exit if unauthenticated
        if (req.isUnauthenticated()) {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        var queryType = req.query.queryType;
        var queryString = "";

        if (queryType === "min") {
            queryString = "this.textArray.length >= " + req.query.textFieldsCount + " && " +
                          "this.imageArray.length >= " + req.query.imageFieldsCount + " && " +
                          "this.displayLength >= " + req.query.minDisplayLength;
        }
        else if (queryType === "max") {
            queryString = "this.textArray.length <= " + req.query.textFieldsCount + " || " +
                          "this.imageArray.length <= " + req.query.imageFieldsCount + " || " +
                          "this.displayLength <= " + req.query.minDisplayLength;
        }

        // Get messages from database filtered by query.
        db.collection('messages')
            .find({
                $where: queryString
            })
            .toArray(function (err, docs) {
                // If there is an error, display it
                if (err) {
                    console.log('Unable to fetch messages from db. Error:', err);
                }
                else {
                    // Return messages
                    res.json(docs);
                }
            });
    });

    // Handle ajax request to serve appropriate messages using parameter routing
    app.post('/api/messages/add', function (req, res) {
        if (req.isUnauthenticated()) {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        console.log('Adding message : ' + req.body);
        // Add a message to the database.
        var result = db.collection('messages')
                       .insertOne(req.body)
                       .then(function (result) {
                            // Notify clients they need to update
                            sendRequeryNotification();

                            res.status(200).json({inserted: result.insertedCount > 0});

                       }, function (error) {
                            console.log(error);

                            res.status(404).json({inserted: false});
                       });
    });

    // Handle ajax request to serve appropriate messages using parameter routing
    app.post('/api/messages/delete', function (req, res) {
        if (req.isUnauthenticated()) {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        console.log('Deleting message with id : '+  req.body._id);
        // Delete a message from database
        var result = db.collection('messages')
                       .removeOne({ _id: new mongoDBClient.ObjectID(req.body._id) })
                       .then(function (result) {
                            // Notify clients they need to update
                            sendRequeryNotification();

                            res.status(200).json({deleted: result.deletedCount > 0});

                       }, function (error) {
                            console.log(error);

                            res.status(404).json({deleted: false});
                        });
    });

    // Handle ajax request to serve appropriate messages using parameter routing
    app.post('/api/messages/update', function (req, res) {
        if (req.isUnauthenticated()) {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        console.log('Updating message with id : '+  req.body._id);

        // Update a message in the database.
        var result = db.collection('messages')
                       .updateOne({ _id: new mongoDBClient.ObjectID(req.body._id) },
                       {
                            name: req.body.name,
                            textArray: req.body.textArray,
                            imageArray: req.body.imageArray,
                            videoPath: req.body.videoPath,
                            screensArray: req.body.screensArray,
                            templateUrl: req.body.templateUrl,
                            displayLength: req.body.displayLength,
                            timeFrames: req.body.timeFrames
                       },
                       { upsert: false })
                       .then(function (result) {
                            // notify clients they need to update
                            sendRequeryNotification();

                            // success
                            res.status(200).json({updated: result.modifiedCount > 0});
                        }, function (error) {
                            console.log(error);

                            res.status(404).json({updated: false});
                        });
    });

    // Handle ajax request to serve appropriate messages using parameter routing
    app.get('/api/screen=:screenId', function (req, res) {
        var screenId = parseInt(req.params.screenId);

        // Get the current date
        //var date = new Date();

        // FOR DEBUG PORPUSES!!!!!!
        // -----------------------
        var date = new Date(2016, 3, 11, 18, 0, 0, 0);

        var timestamp = date.getTime() / 1000;
        // ------------------------

        // Get messages with time stamp filtering.
        db.collection('messages')
            .find({
                    screensArray: screenId,
                    "timeFrames.startDate": {$lte: timestamp},
                    "timeFrames.endDate": {$gte: timestamp},
                    "timeFrames.startTime": {$lte: date.getHours()},
                    "timeFrames.endTime": {$gte: date.getHours()},
                    "timeFrames.daysInWeek": date.getDay()
                }
            ).toArray(function (err, docs) {
                if (err) {
                    console.log('Unable to fetch messages from db. Error:', err);
                }
                else {
                    console.log('Fetching messages for screen %d. fetched total of %d messages.',
                                req.params.screenId, docs.length);

                    res.json(docs);
                }
            });
    })

    /**
     * Notify clients that they need to requery.
     */
    function sendRequeryNotification() {
        io.sockets.emit('requeryNeeded', {});
    }
}