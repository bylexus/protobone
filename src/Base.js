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
