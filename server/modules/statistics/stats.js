/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
module.exports = function statsModule(app, db, path, express) {
    // Handle ajax request to serve appropriate messages using parameter routing
    app.get('/api/stats/csv', function (req, res) {
        if (req.isUnauthenticated()) {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        // Build csv with statistical data
        var data = "";
        var daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var recordsAmount = 0;
        var counter = 0;

        // Get the distinct messages templates
        db.collection('messages')
            .distinct('templateUrl')
            .then(function (templates) {
                // Calculate amount of records we need to write
                    recordsAmount = daysInWeek.length * templates.length;

                    templates.forEach(function (template, outterIndex, templates) {
                        daysInWeek.forEach(function (day, innerIndex, days) {
                            // Count the messages in the database with the given template and given name
                            db.collection('messages').count(
                                {
                                "templateUrl": template,
                                "timeFrames.daysInWeek": innerIndex
                                }
                            ).then(function (count) {
                                data += template.replace('templates/', 'Template ')
                                        .replace('.css', '')
                                    + "-" + day + ","
                                    + count
                                    + "\n";

                                counter++;

                                // Return answer if this is the last day of the last template
                                if (counter === recordsAmount) {
                                    res.attachment('data.csv');
                                    res.setHeader('Content-Type', 'text/csv');
                                    res.end(data);
                                }
                            }, function (error) {
                                console.log(error);
                            })
                        });
                    });
                }, function (error) {
                    console.log(error);
                });
    });

    app.get('/api/stats/json', function (req, res) {
        if (req.isUnauthenticated()) {
            res.status(401).json({reason: 'Request is unauthenticated'});
        }

        var daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var rootNode = {
            name: 'flare',
            children: []
        };
        var counter = 0;

        daysInWeek.forEach(function (day, index, days) {
            // Find the messages displayed in the given day and group them by display length
            db.collection('messages').aggregate(
                [
                    { $match: { 'timeFrames.daysInWeek': index } },
                    { $group: { "_id": "$displayLength", "count": { $sum: 1 } } }
                ]
            ).toArray(function(err, result) {
                console.log(day);
                console.log(result);

                // A list of 'groups' objects to be pushed as the children of the current day object
                var groups = [];

                // Create the hierarchical object for each group
                result.forEach(function(group){
                    groups.push({
                       name: group._id,
                       children: [],
                       size: group.count
                   });
                });

                // Create an hierarchical object for the current day, containing the hirarchial data
                // for each group and push hierarchical objects to the current day object
                rootNode.children.push({
                    name: day,
                    children: groups
                });

                // If this is the last iteration
                if (++counter === days.length) {
                    res.status(200).json(rootNode);
                }
            });
        });
    });
}