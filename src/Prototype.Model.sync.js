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
 * override Prototype.Model.sync with your own implementation.
 *
 * @author Alexander Schenkel <alex@alexi.ch>
 * @copyright 2015 Alexander Schenkel
 * @license Released under the MIT License
 * @class Prototype.Model
 */
(function(P) {
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

	// Extend Prototype.Model class:
	if (P && P.Model) {
		Object.extend(P.Model, {
			/**
			 * If set to true, only use GET (read) and POST (create,update,delete) HTTP
			 * Methods, and set the X-HTTP-Method-Override request header with the
			 * true method.
			 *
			 * NOTE: TODO: At the moment, only legacy methods (GET/POST) are supported (emulateHTTP: true),
			 * because the Prototype JS library does NOT support other requests than POST/GET.
			 * So set emulateHTTP to false does not change a thing, unfortunately...
			 *
			 */
			emulateHTTP: true,

			/** TODO: Implement emulateJSON to use a post body instead of RAW json*/
			emulateJSON: false,

			/**
			 * This method is where the real server communication happens. It uses
			 * Prototype's Ajax.Request to send / load data to/from a REST backend.
             * It is called in a static context (`Prototype.Model.sync`) from a Model's instance
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
             * @param {Prototype.Model} model A model instance to be sent / updated to /from the server
             * @param {Object} options Additional Ajax.Request options
             * @static
			 */
			sync: function(url, method, model, options) {
				var httpMethod = mapMethods(method, this.emulateHTTP),
					ajaxOptions = {
						method: httpMethod,
						contentType: 'application/json',
						postBody: Object.toJSON(model.get()),
						requestHeaders: {}
					};
				if (this.emulateHTTP) {
					ajaxOptions.requestHeaders['X-HTTP-Method-Override'] = httpMethods[method];
				}
				options = options || {};
				Object.extend(ajaxOptions, options);

				return new Ajax.Request(url, ajaxOptions);
			}
		});
	}
}(Prototype));
