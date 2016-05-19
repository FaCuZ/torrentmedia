# Object Settings
Extends a custom JavaScript Object with "settings" methods.
This is similar to the "Configurable" module but provides several additional functions, most notably usage of Events.

## Basic Usage
Add Settings methods to a basic Object.

```javascript
  // Get module
  var ObjectSettings = require( 'object-settings' );

  // Create target object
  MyObject = {
   my_data: {},
   my_method: function() {}
  };

  // Mixin Object Setting methods into MyObject
  ObjectSettings.mixin( MyObject );

  // Set a key and value
  MyObject.set( 'first_name', 'John' );

  // Set via an object
  MyObject.set({
   'age': 42,
   'last_name': 'Adams'
  });
```

## Advanced Usage

```javascript
  // Create target object
  var MyObject = {};

  // Set properties and apply Object Settings to a property
  Object.defineProperties( MyObject, {
    "my_data": {
      "value": {}
    },
    "settings": {
      "value": new ObjectSettings
    }
  });

  // Interact with settings via the custom property
  MyObject.settings.set( 'some key', 'some value' );
```

## Setting Defaults

```javascript
  // Get module
  var ObjectSettings = require( 'object-settings' );

  // Create target object
  var MyObject = {
    my_data: {},
    my_method: function() {}
  };

  // Bind to Object with default settings
  MyObject.settings = ObjectSettings.use( MyObject, {
    "name": "Sparky",
    "color": "red"
  });
```

## Constructor Methods
Constructor methods are only available on the non-initialized Object Settings module.

  .debug()
  .use()
  .mixin()
  .extend()

## Object Settings' Methods
The below methods are available once an Object Settigns instance is created.

  .get( name )
  .set( name, val )
  .set( obj )
  .enable( name )
  .disable( name )

## Event Usage
If your object is EventEmitter-capable the Object Settings will emit events when settings are changed.

```javascript

  // Trigger an event when the name is set
  MyClass.on( "set:name", function( value, key ) {
    console.log( key, "changed to ", value );
  });

  // Trigger an event when the name is set
  MyClass.on( "disable:name", function( value, key ) {
    console.log( key, "disabled" );
  });

  // Set and disable the name, triggering the above events
  MyClass.set( "name", "Sparky" );
  MyClass.disable( "name" );
```

## License

(The MIT License)

Copyright (c) 2013 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
