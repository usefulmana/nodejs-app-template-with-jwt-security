const config = require("../config.json");
const mongoose = require('mongoose');

mongoose.connect(config['uri'], { useNewUrlParser: true }, (err) => {
    if (err) console.log(err);
    console.log('Successfully connect to database');
});

module.exports = mongoose;