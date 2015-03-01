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
 * @extends Protobone.Base
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

    /**
     * Defines the model class used when adding models via attribute array.
     *
     * @property model
     * @type {Class}
     */
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
            var m = null;
            if (item instanceof Model) {
                m = item;
            } else if (typeof item === 'object') {
                m = new this.model(item);
            }
            if (m) {
                m.on('updated', this._bubbleUpdatedEvent.bind(this));
            }
            return m;
        },this);
        this.models = [this.models, newData].flatten().compact();
        this._updateLength();
        this.fireEvent('add',newData, this);
        return this;
    },

    /**
     * Returns the model by specific ID
     *
     * @method get
     * @param {mixed} id The ID of the model
     * @return {Model} The model if found, or null
     */
    get: function(id) {
        var m = new this.model();
        return this.findBy(m.idAttribute,id);
    },

    /**
     * Find a model by a specific attribute value.
     *
     * @method findBy
     * @param {String} attribute The name of the attribute
     * @param {Mixed} value The value of the attribute
     * @param {Model} Returns the first model with a matching attribute value, or null if none can be found
     */
    findBy: function(attribute,value) {
        var found = null;
        this.forEach(function(item) {
            if (item.get(attribute) === value) {
                found = item;
                return false;
            }
        });
        return found;
    },

    /**
     * alias for add(), to support "array like" behaviour
     *
     * @method push
     * @params {Object} Same as add, data The array / object of model(s) to be added
     */
    push: function(model) {
        return this.add(model);
    },


    /**
     * returns the model at the given index, or null if index is out of bounds
     *
     * @method at
     * @param {Integer} index The index to fetch the model for
     * @return {Model} The model at the index or null
     */
    at: function(index) {
        if (index < 0 || index > this.length-1) return null;
        return this.models[index];
    },

    /**
     * loops over all models and calls the given callback with `callback(model,index)`.
     * Return false within the callback to cancel the loop.
     *
     * @method forEach
     * @param {Function} callback The callback for every item to be called. Return false to cancel the loop
     * @param
     */
    forEach: function(callback, scope) {
        var i,ret;
        for (i = 0; i < this.models.length; i++) {
            ret = callback.call(scope,this.models[i],i);
            if (ret === false) break;
        }
    },

    _bubbleUpdatedEvent: function() {
        this.fireEvent.apply(this,['updated',$A(arguments)].flatten());
    }
});

// Adding support for JS Modules through browserify / ES 6:
module.exports = Collection;
