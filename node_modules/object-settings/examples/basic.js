/**
 * -
 *
 * -
 *
 * @author potanin
 * @date 6/9/13
 */

// Get module
var ObjectSettings = require( '../' );

// Create target object
var MyObject = {
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

module.exports = MyObject;