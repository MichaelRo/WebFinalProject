/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
module.exports = function adminModule(app, db, path, express, passport) {
    var LocalStrategy = require('passport-local').Strategy;

    // setup us static middleware to serve static files along with the HTML (such as CSS and JS files)
    app.use(express.static('client/modules/admin'));

    // handle main GET request and serve landing page
    app.get('/admin', function (req, res) {
        res.sendFile(path.resolve('client/modules/admin/admin.html'));
    });

    // setup user authentication
    passport.use(new LocalStrategy(function(username, password, done) {
        db.collection('admins')
            .find({
                'username': username
            }).limit(1)
            .next(function(err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false);
                }

                if (user.password != password) {
                    return done(null, false);
                }

                return done(null, user);
            });
    }));

    passport.serializeUser(function(user, done) { done(null, user); });

    passport.deserializeUser(function(user, done) { done(null, user); });

    app.post('/api/login',
        passport.authenticate('local', {
            successRedirect: '/api/loginSuccess',
            failureRedirect: '/api/loginFailure'
        }),
        function(req, res) {
            console.log(req.isAuthenticated()); // true
    });

    app.get('/api/logout', function(req, res) {
        req.logout();
        res.status(200).json({status: 'Bye!'});
    });

    app.get('/api/loginFailure', function(req, res, next) {
        res.status(500).json({err: 'Could not log in admin'});
    });

    app.get('/api/loginSuccess', function(req, res, next) {
        res.status(200).json({status: 'Login successful!'});
    });
}