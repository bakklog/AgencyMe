// packages

const dotenv = require('dontenv');


// Load enviroment varibals from .env file,  where API key and passwords (should be stored)
dotenv.load({
    path: '.env'
});