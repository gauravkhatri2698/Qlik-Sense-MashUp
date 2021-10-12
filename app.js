var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mysql=require("mysql2");
var session = require('express-session');
const dotenv=require("dotenv");
var router = require('./routes/pages');
var auth_router = require('./routes/auth');

var app = express();

app.use(session({ 
  secret: '123456cat',
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: { maxAge: 1 * 60 * 60 * 1000 }
}));

dotenv.config({ path: './.env'});

const db=mysql.createConnection({    
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

db.connect((error)=>{
  if(error){
      console.log(error);
  }else{
      console.log("db connected ..");
  }
});

app.use('/', router);
app.use('/auth', auth_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
