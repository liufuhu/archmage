var express			= require('express');
var ejs				= require('ejs');
var engine			= require('ejs-mate');
var path 			= require('path');
var _           	= require('lodash');
var expressLayouts 	= require('express-ejs-layouts');
var app				= express();
var bodyParser      = require('body-parser');
var compress 		= require('compression');

var config			= require('./config');
var routes			= require('./routes');


// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', engine);
app.set('layout', 'layout.html');
app.use(expressLayouts);
app.enable('trust proxy');

// set static, dynamic helpers
_.extend(app.locals, {
  config: config
});


// resource files
app.use('/res',express.static(path.join(__dirname, 'resources')));
app.use('/static',express.static(path.join(__dirname, 'static')));

// body parser
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));


// route logic
app.use('/', routes);

// handling 404 errors
app.use(function(err, req, res, next) {
    if(err.status !== 404) {
        return next();
    }
    res.send(err.message || '** no unicorns here **');
});

app.listen(3000, function(){
	console.log("server is ok");
});