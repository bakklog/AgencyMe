const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const passport = require('passport');
const errorHandler = require('errorhandler');
const expressStatusMonitor = require('express-status-monitor');
const logger = require('morgan');

// Load enviroment varibals from .env file,  where API key and passwords (should be stored)
dotenv.load({
    path: '.env'
});

// Initiate express
const app = express();

// Express status monitor
app.use(expressStatusMonitor());

// Handle the errors
app.use(errorHandler());
app.use(logger('dev'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
// const invoices = require('./routes/api/users/invoices');
// const domains = require('./routes/api/users/domains');


// Setup port and ip
app.set('host', '0.0.0.0');
app.set('port', process.env.PORT || 8080);

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, `${chalk.red('✗')} MongoDB connection error. Please make sure MongoDB is running.`));
db.once('open', () => {
  console.log(`${chalk.green('✓')} MongoDB database connected. Let's go 💪`)
});

// Passport middleware
app.use(passport.initialize());

// Passport config
// TODO:
require('./config/passport')(passport);

// Routes
app.use('/api/users', users);
app.use('/api/profile', profile);

app.listen(app.get('port'), () => {
    console.log(`${chalk.green('✓')} App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
    console.log('Press CTRL-C to stop\n');
});