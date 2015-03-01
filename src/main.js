var statics = require('./statics.js'),
    Model = require('./Model.js'),
    Collection = require('./Collection.js');

// Adding support for JS Modules (UMD Model) through browserify / ES 6:
module.exports = Object.extend(statics, {
    Model: Model,
    Collection: Collection
});
