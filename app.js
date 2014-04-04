
/**
 * Module dependencies.
 */
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var app = express();
var http = require('http');
var path = require('path');
var indexController = require('./controllers/indexController');
var adminController = require('./controllers/adminController');
var commentController = require('./controllers/commentController');
var mongoose = require('mongoose');

mongoose.connect('localhost', 'tala');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

var userData = mongoose.createConnection('mongodb://localhost/tala/users');
var postData = mongoose.createConnection('mongodb://localhost/tala/posts');
var commentData = mongoose.createConnection('mongodb://localhost/tala/comments')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
});

userSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

var User = mongoose.model('User', userSchema);
var user = new User({ username: 'bob', email: 'bob@example.com', password: 'secret' });
user.save(function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('user: ' + user.username + " saved.");
  }
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

///////////*******////ROUTES////********//////////////////

app.get('/admin', ensureAuthenticated, function(req, res){
  res.render('admin');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/admin');
    });
  })(req, res, next);
});


app.get('/' , indexController.mainView);

app.get('/about' , function (req,res){
  res.render('about');
});

app.post('/findBeach' , indexController.findBeach);
app.post('/detailReport' , indexController.detailReport);

app.post('/createPost' , adminController.createPost);

app.get('/logout', function (req, res){
	  req.logout();
	  res.redirect('/');
	});

app.post('/comment' , commentController.saveComment)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}




