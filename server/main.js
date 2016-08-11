/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

var path = require('path');
var express = require('express');
var _ = require('underscore');
var mongodb = require('mongodb');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

// server modules
var statsModule = require('./modules/statistics/stats.js');
var adminModule = require('./modules/admin/admin.js');
var messagesModule = require('./modules/messages/messages.js');

// We need to work with "MongoClient" interface in order to connect to a mongodb server.
var mongoClient = mongodb.MongoClient;
var app = express();

// Connection URL. This is where your mongodb server is running.
var mongoUrl = 'mongodb://localhost:27017/ads';

// Use connect method to connect to the Server
mongoClient.connect(mongoUrl, function(err, db) {
    // If unable to connect to database
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        return;
    }

    // Add middle wares
    app.use(cookieParser());
    app.use(bodyParser());

    // Required for passport
    app.use(session({ secret: 'ads' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    // Serve static files to the client
    var node_module_path = path.resolve('node_modules');
    app.use(express.static(node_module_path + '/bootstrap/dist'));
    app.use(express.static(node_module_path + '/underscore'));
    app.use(express.static(node_module_path + '/angular'));
    app.use(express.static(node_module_path + '/angular-ui-bootstrap'));
    app.use(express.static(node_module_path + '/angular-ui-router/release'));
    app.use(express.static(node_module_path + '/angular-ui-router-tabs/src'));
    app.use(express.static(node_module_path + '/font-awesome'));
    app.use(express.static(node_module_path + '/angular-ui-grid'));

    // Setup server
    var server = app.listen(8080, 'localhost', function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Ads app listening at http://%s:%s', host, port);
    });

    // Listening on sockets IO
    var io = require('socket.io').listen(server);

    // Create instances and init each application module
    var admin = new adminModule(app, db, path, express, passport);
    var stats = new statsModule(app, db, path, express);
    var messages = new messagesModule(app, db, path, express, mongodb, io);

    // Define connection event
    io.sockets.on('connection', function(client){
        // new client has connected
        console.log('New client connected. id: %s', client.id);

        //Define disconnection event
        client.on('disconnect', function() {
            // client has disconnected
            console.log('Client disconnected. id: %s', client.id);
        })
    });
});