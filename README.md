[![Build Status](https://travis-ci.org/bylexus/prototypejs-model.svg?branch=master)](https://travis-ci.org/bylexus/prototypejs-model)

Prototype.Model
================

> PrototypeJS Model extension - Enables Prototype JS users to fetch / store Models from / to a backend using AJAX / REST

This addition to [the PrototypeJS Library](http://prototypejs.org/) enables users to define Entity Models and store / fetch (make persistent) them to a backend. Also known as [the "M" from MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).

This library is heavily inspired (but not copied) by the famous [Backbone](http://backbonejs.org/) library. Most of the methods use the same name. It exists mainly for an old project with no possibility to switch to a Model-enabled framework like backbone.

Usage example:
--------------
Fetch with:

```
git clone https://github.com/bylexus/prototypejs-model.git
```

```html
<!-- require prototype and the Prototype.Model addition: -->
<script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.2.0/prototype.js"></script>
<script src="dist/prototype-model.min.js"></script>

<!-- Usage example -->
<script>
	// Create your own Model class:
	var Person = Class.create(Prototype.Model,{
	    urlRoot: '/entity/Person'
	});

	// Use an instance of the model:
	var alex = new Person({
	    name: 'Schenkel',
	    firstname: 'Alex'
	});

    // add an update listener:
    alex.on('updated', function(rec,newVals, oldVals) {
        console.log("new values of "+rec.get('name'),newVals);
    });

	alex.set('age','too old');

	// Make it persistent:
	alex.save({onSuccess: function(res,model){
	    console.log(model.getId());
	}});
</script>
```

API
-----

Please find the [API docs](http://bylexus.github.io/prototypejs-model/) online:

* [Prototype.Model](http://bylexus.github.io/prototypejs-model/classes/Prototype.Model.html)

Developing
-----------

```
git clone https://github.com/bylexus/prototypejs-model.git
npm install
```

run tests:

```
grunt test
```

build debug and minified version:
```
grunt uglify
```

build docs:
```
grung doc
```


TODO
-----
There is still a lot to do. This addition is not yet finished. This is what still need to be done:

* implement Collections with support to batch load/sync Models
* implement emulate JSON in Model.Prototype.sync
* implement an event system (e.g. on model updates etc.)
* implement defaults on Model
* implement validation (on save (triggers invalid event), on set (optional))


License
---------
Licensed under the MIT license. Copyright 2015 by Alexander Schenkel <alex@alexi.ch>
