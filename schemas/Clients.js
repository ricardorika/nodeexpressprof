const {Schema} = require('mongoose');
module.exports = new Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    address: String,
    zipcode: String,
    neighborhood: String,
    city: String,
    state: String    
});
