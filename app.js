var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');

var index = require('./routes/index');
var users = require('./routes/users');

const tmpDir = __dirname + '/tmp/';

// canvas generator
const CountdownGenerator = require('kazzje-generator');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/*app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());*/
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//app.use('/users', users);

// generate and download the gif
app.get('/generate', function (req, res) {
    let {time, width, height, color, bg, name, frames} = req.query;

    if(!time){
        throw Error('Time parameter is required.');
    }

    CountdownGenerator.init(time, width, height, color, bg, name, frames, () => {
        let filePath = tmpDir + name + '.gif';
        res.download(filePath);
    });
});

// serve the gif to a browser
app.get('/serve', function (req, res) {
    let {time, width, height, color, bg, name, frames} = req.query;

    if(!time){
        throw Error('Time parameter is required.');
    }

    CountdownGenerator.init(time, width, height, color, bg, name, frames, () => {
        let filePath = tmpDir + name + '.gif';
        res.sendFile(filePath);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
