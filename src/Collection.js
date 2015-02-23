/**
 * PrototypeJS Model extension - Enables Prototype JS users to fetch / store
 * Models from / to a backend using AJAX / REST.
 * The Collection class stores Models and allows storing / fetching them in a batch.
 *
 * Inspired by (but not copied) [Backbone's Backbone.Collection](http://backbonejs.org/) and Backbone.sync
 *
 *
 * @author Alexander Schenkel <alex@alexi.ch>
 * @copyright 2015 Alexander Schenkel
 * @license Released under the MIT License
 * @class Protobone.Collection
 * @constructor
 */
var Base = require('./Base.js');
var Model = require('./Model.js');
var Collection = Class.create(Base, {

    /**
     * The URL root for this Collection. Must be set in child classes,
     * e.g. to '/entities/Person', or must be defined in the defined Model.
     *
     * Used by the url() function to build the persistence URL.
     *
     * @property urlRoot
     * @type String
     */
    urlRoot: '',

    model: Model,

    /**
     * Constructor. A data array can be delivered to create Models already during
     * construction time (e.g. `[{name: 'alex'},{name: 'barbara'}]`)
     *
     * @method constructor
     * @param {Array} data Initial data (array of key/value pairs) to create Model's from
     */
    initialize: function($super, data) {
        $super();
        this.models = [];
        this.length = this.models.length;
        this.add(data);
    },

    _updateLength: function() {
        this.length = this.models.length;
    },

    /**
     * The add method takes a Model or an array of Models and adds them to the
     * internal collection. Plain objects can also be delivered, which will be
     * transformed to Prototype.Model instances or, if set, to models of the `this.model` class.
     *
     * @method add
     * @param {Array}{Object} data The array / object of model(s) to be added
     */
    add: function(data) {
        var newData;

        if (!Object.isArray(data)) data = [data];
        newData = data.map(function(item) {
            if (item instanceof Model) return item;
            if (typeof item === 'object') return new this.model(item);
            return null;
        },this);
        this.models = [this.models, newData].flatten().compact();
        this._updateLength();
        this.fireEvent('add',newData, this);
        return this;
    }
});

// Adding support for JS Modules through browserify / ES 6:
module.exports = Collection;
