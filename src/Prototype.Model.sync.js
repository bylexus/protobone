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
			 *
			 * Override this static function if you want to implement your own
			 * method here, maybe your backend API does not match the one provieded here.
			 *
			 * The default method uses the following REST conventions
			 * (see also http://backbonejs.org/#Sync, which heavily inspired this code here):
			 *
			 * method: create -> POST   /collection
			 * method: read   -> GET   /collection[/id]
			 * method: update -> PUT   /collection/id
			 * ((TODO method: patch  -> PATCH   /collection/id ))
			 * method: delete -> DELETE   /collection/id
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