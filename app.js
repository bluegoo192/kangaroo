var express = require('express');
var socket_io = require( "socket.io" );//this may be redundant, check later
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var expressSession = require('express-session');//for passport session handling

//Mongo stuff
var mongo = require('mongodb');//don't think this line is necessary, remove later
//var monk = require('monk');  aatually i think i'll use mongoose
//var db = monk('mongodb://dev_admin:iratewarlock@ds054308.mongolab.com:54308/kangaroo1')
var dbConfig = require('db');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);



//var routes was  here.  its since been moved lower in the program
var users = require('./routes/users');

var app = express();


//Passport configuration
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.session());

//does io really need to be created in two steps? if so, why?
var io = socket_io();
app.io = io;//this is (probably redundant) Step 3

var routes = require('./routes/index')(io);//does order of var creation matter???

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
/* USE THIS STRUCTURE TO LET THE ROUTER USE IO
app.use(function(req,res,next){
    req.db = db;
    next();
});
*/

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//socket.io stuff
/*io.on( "connection", function(socket)
  {
    console.log( "A user connected");
});*/


module.exports = app;
