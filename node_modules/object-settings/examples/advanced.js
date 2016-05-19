/**
 * Advanced Examples
 *
 * -WIP-
 *
 * @author potanin@UD
 * @date 6/9/13
 */

// Create target object
var MyObject = {};

// Set properties and apply Object Settings to a property
Object.defineProperties( MyObject, {
  "my_data": {
    "value": {}
  },
  "settings": {
    "value": require( '../' ).create()
  }
});

// Interact with settings via the custom property
MyObject.settings.set( 'some key', 'some value' );

module.exports = MyObject;