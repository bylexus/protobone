var _ = require('underscore'),
    statics = require('./statics.js'),
    Model = require('./model/Model.js');

// Adding support for JS Modules (UMD Model) through browserify / ES 6:
module.exports = _.extend(statics, {
    Model: Model
});
