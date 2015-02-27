[![Build Status](https://travis-ci.org/bylexus/protobone.svg?branch=master)](https://travis-ci.org/bylexus/protobone)

Protobone
=========

> Backbone-inspired PrototypeJS Model extension - Enables Prototype JS users to fetch / store Models from / to a backend using AJAX / REST

This addition to [the PrototypeJS Library](http://prototypejs.org/) enables users to define Entity Models and store / fetch (make persistent) them to a backend. Also known as [the "M" from MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).

This library is heavily inspired (but not copied) by the famous [Backbone](http://backbonejs.org/) library. Most of the methods use the same name. It exists mainly for an old project with no possibility to switch to a Model-enabled framework like backbone.


Install
--------

with [Bower](http://bower.io/):

`bower install https://github.com/bylexus/protobone.git`

manually using GIT:

`git clone https://github.com/bylexus/protobone.git`

Usage example: Standalone
--------------------------

```html
<!-- require prototype and the Protobone addition: -->
<script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.2.0/prototype.js"></script>
<script src="protobone/dist/protobone.min.js"></script>

<!-- Usage example -->
<script>
    // Create your own Model class:
    var Person = Class.create(Protobone.Model,{
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

    // Load an entity:
    alex = new Person({id: 4});
    alex.fetch({onSuccess: function() {
        console.log('done!');
    }});
</script>
```

Usage example: as AMD module using [requirejs](http://requirejs.org/)
---------------------------------------------------------------------

```html
<!-- load prototype and requirejs: -->
<script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.2.0/prototype.js"></script>
<script src="http://requirejs.org/docs/release/2.1.16/minified/require.js"></script>
<script>
    // load the Protobone class as AMD module:
    require.config({
        paths: {
            'Protobone': 'protobone/dist/protobone.min'
        }
    });

    require(['Protobone'], function(Protobone) {
        // Create your own Model class:
        var Person = Class.create(Protobone.Model,{
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

        // Load an entity:
        alex = new Person({id: 4});
        alex.fetch({onSuccess: function() {
            console.log('done!');
        }});
    });
</script>
```

API
-----

Please find the [API docs](http://bylexus.github.io/protobone/) online:

* [Protobone.Model](http://bylexus.github.io/protobone/classes/Protobone.Model.html)

Developing
-----------

```
git clone https://github.com/bylexus/protobone.git
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
grunt doc
```

Changelog
---------
* 0.0.6: introducing 'rootProperty' on Model to support different server response formats
* 0.0.5: fixing an AMD require dependency bug
* 0.0.4: removed underscore dependency, switched all underscore code to prototype code
* 0.0.3: Changed Name and Namespace from "Prototype.Model" to "Protobone" to make the Library independant from the Prototype namespace and for better UMD integration
* 0.0.2: Switched build process do browserify to support UMD Modules and prepare for ES6
* 0.0.1: first running version including Model


TODO
-----
There is still a lot to do. This addition is not yet finished. This is what still need to be done:

* implement Collections with support to batch load/sync Models
* implement emulate JSON in Protobone.sync
* implement an event system (e.g. on model updates etc.)
* implement defaults on Model
* implement validation (on save (triggers invalid event), on set (optional))


License
---------
Licensed under the MIT license. Copyright 2015 by Alexander Schenkel <alex@alexi.ch>

