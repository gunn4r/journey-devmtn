var express = require('express'),
    expressSession = require('express-session'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./config/config.js');

var usersCtrl = require('./controllers/usersCtrl.js'),
    postsCtrl = require('./controllers/postsCtrl.js'),
    authCtrl = require('./controllers/authCtrl.js'),
    commentsCtrl = require('./controllers/commentsCtrl.js');

require('./controllers/passport')(passport);

var app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + '/../public'));
app.use(expressSession(config.express)); // use separate config file for secret
app.use(passport.initialize());
app.use(passport.session());


// Endpoints

// Auth
app.post('/api/login', passport.authenticate('local-login'), authCtrl.successRespond);
app.post('/api/signup', authCtrl.localSignup, passport.authenticate('local-login'), authCtrl.successRespond);  // signup and login user
app.get('/api/logout', authCtrl.logout);
app.get('/api/current_user', authCtrl.current_user);

// Posts
app.get('/api/posts/filterBy?', authCtrl.requireAuth, postsCtrl.filter); // Get posts. Accepts query parameter that is specially formatted for generic filterin. Posts collection.
app.get('/api/posts/autocomplete?', authCtrl.requireAuth, postsCtrl.autocomplete); // Autocomplete tag entry from posts. Accepts query parameter that is specially formatted for autocomplete. Posts collection.
app.get('/api/posts/getAvg?', authCtrl.requireAuth, postsCtrl.findAvg); // Autocomplete tag entry from posts. Accepts query parameter that is specially formatted for autocomplete. Posts collection.
 app.get('/api/posts', authCtrl.requireAuth, postsCtrl.read); // Get posts. Accepts query parameter. Posts collection.
 app.get('/api/posts/:id', authCtrl.requireAuth, postsCtrl.readOne); // Gets individual post. Posts collection.
 app.get('/api/count/posts', authCtrl.requireAuth, postsCtrl.postCount); // Gets count of all posts. Used for pagination.
 app.put('/api/posts/:id', authCtrl.requireAuth, postsCtrl.update); // Update post. Posts collection.
 app.post('/api/posts/', authCtrl.requireAuth, postsCtrl.create); // Create new post. Posts collection.
 app.delete('/api/posts/:id', authCtrl.requireAuth, postsCtrl.delete); // Delete post. Posts collection.

// Users
app.get('/api/users/filterBy?', authCtrl.requireAuth, usersCtrl.filter); // Get posts. Accepts query parameter that is specially formatted for generic filterin. Posts collection.
app.get('/api/users/autocomplete?', authCtrl.requireAuth, usersCtrl.autocomplete); // Autocomplete name entry from posts. Accepts query parameter that is specially formatted for autocomplete. Users collection.
app.get('/api/users', authCtrl.requireAuth, usersCtrl.read); // Get users. Accepts query parameter. Users collection.
app.put('/api/users/:id', authCtrl.requireAuth, usersCtrl.update); // Update user. Users collection.
app.post('/api/users/', authCtrl.requireAuth, usersCtrl.create); // Create new user. Users collection.
app.delete('/api/users/:id', authCtrl.requireAuth, usersCtrl.delete); // Delete user. Users collection.

// Comments
app.get('/api/comments', authCtrl.requireAuth, commentsCtrl.read); // Get comments. Accepts query parameter. Comments collection.
app.get('/api/count/comments', authCtrl.requireAuth, commentsCtrl.commentCount); // Gets comment count. Accepts query parameter.
app.put('/api/comments/:id', authCtrl.requireAuth, commentsCtrl.update); // Update comment. Comments collection.
app.post('/api/comments/', authCtrl.requireAuth, commentsCtrl.create); // Create new comments. Comments collection.
app.delete('/api/comments/:id', authCtrl.requireAuth, commentsCtrl.delete); // Delete comment. Comments collection.


//DB and Server Init
var mongoUri = config.mongoUri,
    port = (process.env.port || config.port);

mongoose.set('debug', true);
mongoose.connect(mongoUri);
mongoose.connection
  .on('error', console.error.bind(console, 'Connection Error: '))
  .once('open', function() {
    console.log('Connected to MongoDB at', mongoUri.slice(mongoUri.indexOf('@')+1, mongoUri.length));
    app.listen(port, function() {
      console.log('Listening on port ' + port);
    });
  });
