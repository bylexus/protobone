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
        this._registerModelEventHandlers();
        this.models = [];
        this.length = this.models.length;
        this.add(data);
    },

    /**
     * stores event handler functions which will be attached to
     * models on add(): We need a reference to them for
     * later removing the event listeners in remove().
     */
    _registerModelEventHandlers: function() {
        this._modelEventHandlers = {
            updated: this._bubbleUpdatedEvent.bind(this)
        };
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
                m.on('updated', this._modelEventHandlers.updated);
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
        var predicateProps = {};
        predicateProps[attribute] = value;
        return this.findWhere(predicateProps);
    },

    /**
     * Like where,
     * @method findWhere
     * @param {Object} predicateProps A key/value hash with attributes/values to match
     * @return {Model} The first matching model
     */
    findWhere: function(predicateProps) {
        var found = null;
        this.forEach(function(item) {
            if (this._attributeMatcher(item, predicateProps)) {
                found = item;
                return false;
            }
        }.bind(this));
        return found;
    },

    /**
     * Helper method for matching a single model against a set of
     * predicate properties (all must match).
     * Returns true if all predicate props match, false if not.
     */
    _attributeMatcher: function(item, predicateProps) {
        var matches = true;
        $H(predicateProps).each(function(pair){
            matches = matches && item.get(pair.key) === pair.value;
        });
        return matches;
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
     * returns the index of the given model, or -1 if the model is not in the collection.
     *
     * @method indexOf
     * @param {Model} model The model to find
     * @return {Integer} The index, or -1 if not in collection
     */
    indexOf: function(model) {
        return this.models.indexOf(model);
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

    /**
     * Simple application of `filter()` function: returns all models matching
     * the given attributes, e.g.:
     * ```javascript```
     * var c = new Protobone.Collection([
     *     {author: 'Stephen King', title: 'Carrie'},
     *     {author: 'Stephen King', title: 'Needful Things'},
     *     {author: 'Jane Austen', title: 'Persuasion'},
     * ]);
     * var res = c.where({author: 'Stephen King'});
     * // => returns all Models with Stephen King as author
     * ```
     *
     * Multiple attributes are allowed.
     *
     * @method where
     * @see filter
     * @param {Object} predicateProps A key/value hash with attributes/values to match
     * @return {Array} The matching models
     */
    where: function(predicateProps) {
        return this.filter(function(item){
            return this._attributeMatcher(item,predicateProps);
        }.bind(this));
    },

    /**
     * Returns all models matching a given predicate function. The predicate function
     * gets the actual model, and must return `true` if it matches, or `false` if not.
     * Example:
     * ```javascript```
     * var c = new Protobone.Collection([
     *     {author: 'Stephen King', title: 'Carrie'},
     *     {author: 'Stephen King', title: 'Needful Things'},
     *     {author: 'Jane Austen', title: 'Persuasion'},
     * ]);
     * var res = c.filter(function(item){
     *     return item.get('author') === 'Stephen King';
     * });
     * // => returns all Models with Stephen King as author
     * ```
     *
     * @method filter
     * @param {Function} predicate The predicate function as test for each model
     * @return {Array} The matching models
     */
    filter: function(predicate) {
        var res = [];
        this.forEach(function(item) {
            if (predicate(item) === true) {
                res[res.length] = item;
            }
        });
        return res;
    },

    /**
     * Removes the given model(s) (single model or array of models) from the collection.
     * fires a remove event. If the model occurs multiple times, all of them are removed.
     *
     * @method remove
     * @param {Model/Array} The model(s) to be removed
     */
    remove: function(model) {
        // unwind event listeners
        // fire remove event
        var keep = [],
            removed = [];

        if (!Object.isArray(model)) model = [model];
        this.models.each(function(item) {
            if (model.indexOf(item) === -1) {
                keep[keep.length] = item;
            } else {
                item.off('updated',this._modelEventHandlers.updated);
                removed[removed.length] = item;
            }
        }.bind(this));
        this.models = keep;
        this.fireEvent('removed',this,removed);
        this._updateLength();
    },

    /**
     * Removes the model at the index given.
     *
     * @method remove
     * @param {Integer} The index of the model to be removed
     */
    removeAt: function(index) {
        return this.remove(this.at(index));
    },

    _bubbleUpdatedEvent: function() {
        this.fireEvent.apply(this,['updated',$A(arguments)].flatten());
    }
});

// Adding support for JS Modules through browserify / ES 6:
module.exports = Collection;
