var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');



var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));




app.use(cookieParser());
//app.enable('trust proxy');


app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



var port = 4000

app.listen(port, function () {
  console.log('Server Started on ' + port)
});


module.exports = app;
