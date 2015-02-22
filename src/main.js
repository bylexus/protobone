var statics = require('./statics.js'),
    Model = require('./model/Model.js');

// Adding support for JS Modules (UMD Model) through browserify / ES 6:
module.exports = Object.extend(statics, {
    Model: Model
});
