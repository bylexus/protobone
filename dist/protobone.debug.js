!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.Protobone=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Base class for Protobone classes. Shared functions which are needed in all classes. This class is not
 * meant to be instantiated by itself.
 *
 * @author Alexander Schenkel <alex@alexi.ch>
 * @copyright 2015 Alexander Schenkel
 * @license Released under the MIT License
 * @class Protobone.Base
 * @constructor
 */
var Base = Class.create({
    initialize: function() {
        this._listeners = {};
    },

    /**
     * Registers an event handler.
     * It does not check on duplicity, so you can add the same event
     * handler multiple times.
     *
     * @method on
     * @param {String} eventName The name of the event, e.g. 'updated'
     * @param {Function} callback The listener function, called with event-specific {parameters}
     * @param {boolean} this
     */
    on: function(eventName, callback) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [];
        }
        this._listeners[eventName].push(callback);
        return this;
    },

    /**
     * Removes a specific event handler for an event, or removes
     * all listerners from an event.
     *
     * @method off
     * @param {String} eventName E.g. 'updated'
     * @param {Function} callback The callback to remove. If omitted, all callbacks
     *   for a specific event are removed
     * @param {Boolean} this
     */
    off: function(eventName, callback) {
        var handlerArr,index;

        if (!callback) {
            // remove all handlers for an event:
            this._listeners[eventName] = [];
        } else {
            // only remove specific hander:
            handlerArr = this._listeners[eventName];
            while (handlerArr && handlerArr.indexOf(callback) > -1) {
                handlerArr.splice(handlerArr.indexOf(callback),1);
            }
        }
        return this;
    },

    /**
     * Fires an event, informing all listneners that are registered for
     * the given event name. The fireEvent function can be called with
     * any number of additional arguments, which are then passed to the event
     * handler function.
     *
     * Returns true if NONE of the registered handlers return false: As soon as
     * one listener returns false, fireEvent will also return false.
     *
     * @method fireEvent
     * @param {String} eventName The event to fire, e.g. 'updated'
     * @return {Boolean} true when non of the listeners returned false, false if they do so.
     */
    fireEvent: function(eventName) {
        var args = $A(arguments).splice(1),
            allTrue = true;
        $A(this._listeners[eventName]).each(function(listener) {
            if (listener instanceof Function) {
                allTrue = allTrue && listener.apply(null,args) !== false;
            }
        }.bind(this));
        return allTrue;
    }
});

module.exports = Base;

},{}],2:[function(require,module,exports){
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

    push: function(model) {

    },

    at: function(id) {

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

},{"./Base.js":1,"./Model.js":3}],3:[function(require,module,exports){
/**
 * PrototypeJS Model extension - Enables Prototype JS users to fetch / store
 * Models from / to a backend using AJAX / REST
 *
 * Inspired by (but not copied) [Backbone's Backbone.Model](http://backbonejs.org/) and Backbone.sync
 *
 * Usage example:
 *
 * ```javascript
 * // Create your own Model class:
 * var Person = Class.create(Protobone.Model,{
 *     urlRoot: '/entity/Person'
 * });
 *
 * // Use an instance of the model:
 * var alex = new Person({
 *     name: 'Schenkel',
 *     firstname: 'Alex'
 * });
 * alex.save({onSuccess: function(res,model){
 *     console.log(model.getId());
 * }});
 * ```
 *
 * @author Alexander Schenkel <alex@alexi.ch>
 * @copyright 2015 Alexander Schenkel
 * @license Released under the MIT License
 * @class Protobone.Model
 * @extends Protobone.Base
 * @constructor
 */
var statics = require('./statics.js');
var Base = require('./Base.js');
var Model = Class.create(Base, {

    /**
     * Defines the name of the ID attribute. Defaults to `id`.
     *
     * @property id
     */
    idAttribute: 'id',

    /**
     * The URL root for this Model. Must be set in child classes,
     * e.g. to '/entities/Person'.
     * Used by the url() function to build the persistence URL.
     *
     * @property urlRoot
     * @type String
     */
    urlRoot: '',

    /**
     * Used by the parse() function, it defines the root property
     * in the server's json response which contains the
     * payload data for the model. Defaults to null (delivered json
     * directly contains model attributes)
     *
     * @property rootProperty
     */
    rootProperty: null,

    /**
     * Constructor. Sets the given data (key/value pairs)
     * as attributes on new model instances.
     *
     * @method constructor
     * @param {Object} data Initial data (key/value pairs) to set on the new Model instance, e.g.: `{name: 'Alex',age: 26}`
     */
    initialize: function($super, data) {
        $super();
        data = data || {};
        this._attributes = {};

        /** TODO: Implement dirty attribute detection */
        this._dirtyAttributes = {};

        this.set(data);
    },

    /**
     * Returns the instance's ID of the model. Null means it is a new, not saved
     * instance.
     *
     * @method getId
     * @return {mixed} The ID (int, string), if any
     */
    getId: function() {
        return this[this.idAttribute] || null;
    },

    /**
     * Sets the Model instance's ID. It also sets it as attribute
     * value so that it is sent to the server when synced.
     *
     * @method setId
     * @param {mixed} id The id to set (e.g. an integer, or even a string)
     * @return {this} Supports fluent interface by returning itself
     */
    setId: function(id) {
        this[this.idAttribute] = id || null;
        this._attributes[this.idAttribute] = id || null;
        return this;
    },

    /**
     * Sets Model attributes (key/values). Takes either a key and a value,
     * or a plain object containing key/value pairs.
     *
     * @method set
     * @param {string}/Object keyOrObject A string representing the key (e.g. 'name')
     *    or an object with key/values (e.g. 'name':'alex','age':'too old')
     * @param {mixed} value The value to set if keyOrObject is a string. Ignored when keyOrObject is an object.
     * @return {this} Supports fluent interface by returning itself
     */
    set: function(keyOrObject, value) {
        var oldValues = {},
            newValues = {},
            obj = {};
        if (typeof keyOrObject === 'string') {
            obj[keyOrObject] = value;
        } else if (typeof keyOrObject === 'object') {
            obj = keyOrObject;
        }

        $H(obj).each(function(pair) {
            this._setAttribute(pair.key, pair.value,newValues,oldValues);
        }.bind(this));
        this.fireEvent('updated',this,newValues,oldValues);
        return this;
    },

    /**
     * Sets a single Model attribute (e.g. 'name' to 'Alex'). Internal helper function.
     * Please use set() instead.
     *
     * @param {string} key The key of the attribute to set, e.g. 'name'
     * @param {mixed} value The value to set
     * @return {this} Supports fluent interface by returning itself
     */
    _setAttribute: function(key, value,newVals, oldVals) {
        if (typeof key === 'string') {
            if (this._attributes[key] !== value) {
                if (oldVals) oldVals[key] = this._attributes[key];
                if (newVals) newVals[key] = value;
                this._dirtyAttributes[key] = value;
            }

            this._attributes[key] = value;
            if (key === this.idAttribute) {
                this.setId(value);
            }
        }
        return this;
    },

    /**
     * Returns a specific attribute, or all if key is omitted
     *
     * @method get
     * @param {string} key The name of the attribute to get. If omitted, an object
     *    containing all attributes (key/value) is returned.
     * @return {mixed} The value of the requested attribute, or an object with all attributes
     */
    get: function(key) {
        if (!key) {
            return Object.clone(this._attributes);
        }
        if (this.hasAttribute(key)) {
            return this._attributes[key];
        } else {
            return null;
        }
    },

    /**
     * Creates the REST url for the actual state of the Model. Override this
     * method if you want to implement your own URL scheme. Here is how it works
     * by default:
     *
     * - non-persistent state (id = null): return '<urlRoot>'
     * - persistent state (id <> null): return '<urlRoot>/<id>'
     *
     * @method url
     * @return {String} The URL for this Model instance, e.g. `/root/Entity/3`
     */
    url: function() {
        var url = this.urlRoot;
        if (!url) throw new Error("urlRoot not set. Please define an urlRoot in your model.");

        if (!!this.getId()) {
            url += '/' + String(this.getId());
        }
        return url;
    },

    /**
     * Makes this model persistent by sending the data to a REST interface (by default).
     * Make sure to set the urlRool property on class definition.
     *
     * options are all options that Prototype's Ajax.Request understands, so you
     * can e.g. deliver a onSuccess callback:
     *
     * ```javascript
     * myModel.save({onSuccess: function(response,model){
     *     // do something after save here
     * }});
     * ```
     *
     * @method save
     * @param {Object} options Additional Ajax options to be sent to Ajax.Request.
     */
    save: function(options) {
        var url = this.url(),
            method = !!this.getId()?'update':'create';

        return this._request(url, method, options);
    },

    /**
     * Fetches this Model's representation from the server. Only
     * allowed for existing (id <> null) models. options is passed
     * along to Prototype's Ajax.Request function.
     *
     * @method fetch
     * @param {Object} options Additional Ajax options to be sent to Ajax.Request.
     */
    fetch: function(options) {
        if (!this.getId()) throw new Error('Cannot be called for new Models');

        var url = this.url(),
            method = 'read';

        return this._request(url, method, options);
    },

    /**
     * invokes a delete request to the server.  Only
     * allowed for existing (id <> null) models. options is passed
     * along to Prototype's Ajax.Request function.
     *
     * After the deletion was successful, the model instance is updated with the
     * server data, even if the server removed the instance.
     *
     * @method destroy
     * @param {Object} options Additional Ajax options to be sent to Ajax.Request.
     */
    destroy: function(options) {
        if (!this.getId()) throw new Error('Cannot be called for new Models');

        var url = this.url(),
            method = 'delete';

        return this._request(url, method, options);
    },

    /**
     * internal helper function for initiating the requests for save, fetch, destroy
     */
    _request: function (url,method,options) {
        var syncOptions = {};

        options = options || {};
        Object.extend(syncOptions, {
            onSuccess: (function(callback) {
                return function(response) {
                    this.parse(response);
                    if (callback instanceof Function) {
                        callback(response,this);
                    }
                }.bind(this);
            }.bind(this)(options.onSuccess))
        });

        return this.sync(url, method, this, syncOptions);
    },

    /**
     * Just calls Protobone.Model.sync. If you want your own, Model-specific implementation,
     * override this function.
     *
     * @see Protobone.Model.sync. Also here: inspired by http://backbonejs.org/#Sync
     * @method sync
     */
    sync: function() {
        return statics.sync.apply(statics,arguments);
    },

    /**
     * Called by save() and fetch() with the server's data response. Fills in the
     * server response to the model. In the default implementation, it just
     * takes the plain JSON object from the server (if any) and store the values on the model.
     * if `rootProperty`is set, the data entry point is set to the rootProperty data.
     *
     * @method parse
     */
    parse: function(response) {
        if (response && response.responseJSON) {
            if (this.rootProperty && response.responseJSON[this.rootProperty]) {
                this.set(response.responseJSON[this.rootProperty]);
            } else {
                this.set(response.responseJSON);
            }
        }
    },

    /**
     * Checks if the model has a certain attribute.
     *
     * @method hasAttribute
     * @param {String} key The attribute name to check
     * @return {Boolean}
     */
    hasAttribute: function(key) {
        return Object.keys(this._attributes).indexOf(key) >= 0;
    }


});

// Adding support for JS Modules through browserify / ES 6:
module.exports = Model;

},{"./Base.js":1,"./statics.js":5}],4:[function(require,module,exports){
var statics = require('./statics.js'),
    Model = require('./Model.js'),
    Collection = require('./Collection.js');

// Adding support for JS Modules (UMD Model) through browserify / ES 6:
module.exports = Object.extend(statics, {
    Model: Model,
    Collection: Collection
});

},{"./Collection.js":2,"./Model.js":3,"./statics.js":5}],5:[function(require,module,exports){
/**
 * PrototypeJS Model extension - Enables Prototype JS users to fetch / store
 * Models from / to a backend using AJAX / REST
 *
 * Inspired by (but not copied) Backbone's Backbone.Model and Backbone.sync
 * @see http://backbonejs.org/
 *
 * This is the static sync method (analog Backbone.sync), which does the server
 * communication. If you want to implement your own method, e.g. if you have another
 * backend interface, or even want to use local storage,
 * override Protobone.Model.sync with your own implementation.
 *
 * @author Alexander Schenkel <alex@alexi.ch>
 * @copyright 2015 Alexander Schenkel
 * @license Released under the MIT License
 * @class Protobone.Model
 */

// Private stuff
var httpMethods = {
	'create': 'post',
	'read'  : 'get',
	'update': 'put',
	'delete': 'delete'
	// TODO: implement PATCH for non-full updates
};
var legacyMethods = {
	'create': 'post',
	'read'  : 'get',
	'update': 'post',
	'delete': 'post'
};

var mapMethods = function(method, emulateHTTP) {
	return ((!!emulateHTTP) ? legacyMethods[method] : httpMethods[method]);
};

var statics = {
    /**
     * If set to true, only use GET (read) and POST (create,update,delete) HTTP
     * Methods, and set the X-HTTP-Method-Override request header with the
     * true method.
     *
     * NOTE: TODO: At the moment, only legacy methods (GET/POST) are supported (emulateHTTP: true),
     * because the Prototype JS library does NOT support other requests than POST/GET.
     * So set emulateHTTP to false does not change a thing, unfortunately...
     *
     * @property emulateHTTP
     * @type {Boolean}
     */
    emulateHTTP: true,

    /**
     * TODO: Implement emulateJSON to use a post body instead of RAW json
     *
     * @property emulateJSON
     * @type {Boolean}
     */
    emulateJSON: false,

    /**
     * This method is where the real server communication happens. It uses
     * Prototype's Ajax.Request to send / load data to/from a REST backend.
     * It is called in a static context (`Protobone.Model.sync`) from a Model's instance
     * and can be overridden if you have to implement your own storage backend (e.g. localstore)
     * or an incompatible API.
     *
     * The default method uses the following HTTP methods
     *
     * * method: create -> `POST /collection`
     * * method: read   -> `GET  /collection[/id]`
     * * method: update -> `POST /collection/id` (Request Header: `X-HTTP-Method-Override: put`)
     * * method: delete -> `POST /collection/id` (Request Header: `X-HTTP-Method-Override: delete`)
     *
     * @method sync
     * @param {String} url The URL for the request
     * @param {String} method The HTTP method. Only supported at the moment: 'get', 'post' (as of Prototype's limitation)
     * @param {Protobone.Model} model A model instance to be sent / updated to /from the server
     * @param {Object} options Additional Ajax.Request options
     * @static
     */
    sync: function(url, method, model, options) {
        var httpMethod = mapMethods(method, statics.emulateHTTP),
            ajaxOptions = {
                method: httpMethod,
                contentType: 'application/json',
                postBody: Object.toJSON(model.get()),
                requestHeaders: {}
            };
        if (statics.emulateHTTP) {
            ajaxOptions.requestHeaders['X-HTTP-Method-Override'] = httpMethods[method];
        }
        options = options || {};
        Object.extend(ajaxOptions, options);

        return new Ajax.Request(url, ajaxOptions);
    }
};

module.exports = statics;

},{}]},{},[4])(4)
});