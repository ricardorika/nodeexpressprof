const {Schema} = require('mongoose');
module.exports = new Schema({
    name: String,
    price: Number,
    description: String,
    url: String
});
