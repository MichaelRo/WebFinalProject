/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
module.exports = function statsModule(app, db, path, express) {

    // handle ajax request to serve appropriate messages using parameter routing
    app.get('/api/stats/csv', function (req, res) {

        // exit if unauthenticated
        if (req.isUnauthenticated())
        {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        // build csv with statistical data
        var data = "";
        var daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var amountOfRecrods = 0;
        var counter = 0;

        // get the distinct messages templates
        db.collection('messages')
            .distinct('templateUrl')
            .then(function (templates) {
                    // update the amount of records we need to write
                    amountOfRecrods = daysInWeek.length * templates.length;
                    // iterate the distinct templates
                    templates.forEach(function (template, outterIndex, templates) {
                        // for every templates iterate the days in week
                        daysInWeek.forEach(function (day, innerIndex, days) {

                            // count the messages in the database
                            // with the given template and given name
                            db.collection('messages')
                              .count(
                                {
                                "templateUrl": template,
                                "timeframes.daysInWeek": innerIndex
                                }
                            ).then(function (count) {

                                // write data
                                data += template.replace('templates/', 'Template ')
                                        .replace('.css', '')
                                    + "-" + day + ","
                                    + count
                                    + "\n";

                                // update data
                                counter++;

                                // return answer if this is the last day
                                // of the last template
                                if (counter === amountOfRecrods) {
                                    // return data
                                    res.attachment('data.csv');
                                    res.setHeader('Content-Type', 'text/csv');
                                    res.end(data);
                                }
                            }, function (error) {
                                // Common error handling
                                console.log(error);
                            })

                        });
                    });
                }
                , function (error) {
                    // Common error handling
                    console.log(error);
                });
    });

    app.get('/api/stats/json', function (req, res) {

        // exit if unauthenticated
        if (req.isUnauthenticated())
        {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        // define days in week array
        var daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var rootNode =
        {
            name: 'flare',
            children: []
        };
        var counter = 0;

        // iterate the days in week
        daysInWeek.forEach(function (day, index, days) {
            // find the messages displayed in the given day and group them by display length
            db.collection('messages').aggregate(
                [
                    { $match: { 'timeframes.daysInWeek': index } },
                    { $group: { "_id": "$displayLength", "count": { $sum: 1 } } }
                ]
            ).toArray(function(err, result) {
                // debug outputs
                console.log(day);
                console.log(result);
                // for the given day, define a list of 'groups' objects to be pushed
                // as the children of the current day object
                var groups = [];
                // create the hierarchical object for each group
                result.forEach(function(group){
                    // add object to group
                    groups.push({
                       name: group._id,
                       children: [],
                       size: group.count
                   });
                });

                // create an hierarchical object for the current day, containing the hirarchial data
                // for each group and push hierarchical objects to the current day object
                rootNode.children.push({
                    name: day,
                    children: groups
                });

                // if this is the last iteration
                if (++counter === days.length)
                {
                    // return the data
                    res.status(200)
                       .json(rootNode);
                }
            });
        });
    });
}