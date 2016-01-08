// Set Up =============================
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var redis = require('redis');

app.use(morgan('dev'));
app.use(bodyParser({limit: '3mb'}));
app.use(bodyParser.urlencoded({ 'extended':'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type:'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));

// Configuration ======================
var devConfig = false;
try {
	devConfig = require('./config/config');
	console.log('Found development config file; using development environment variables')
} catch(err) {
	console.log('No config file detected, assuming production environment variables')
}
var dbUrl = devConfig ? devConfig.dbUrl : process.env.DB_URL;
var dbPort = devConfig ? devConfig.dbPort : process.env.DB_PORT;
var dbPassword = devConfig ? devConfig.dbPassword : process.env.DB_PASSWORD;

// DB ================
var client = redis.createClient(dbPort, dbUrl, {no_ready_check: true});
client.auth(dbPassword, function (err) {
  if (err) console.log(err);
});

app.set('db',client);

// Routes ==============================
require('./app/routes')(app);

// Export the app ======================
exports = module.exports = app;

console.log('=================================');
console.log('=            Ready!             =');
console.log('=================================');