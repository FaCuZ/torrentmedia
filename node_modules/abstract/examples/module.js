/**
 *
 *
 * @version 0.1.0
 * @class Abstract
 * @constractor
 */
require( 'abstract' ).model( function Constructor() {

  // Bind Constructor to "module" object making it available via module.BasicConstructor
  Constructor.module( module );

  // Use the Events module
  Constructor.use( require( 'events' ).prototype );

  // Predefine Default property descriptions
  Constructor.set( 'meta.property.defaults' );

  // Define Constructor Properties using defineProperty semantics or by simply provoding a value
  Constructor.properties( this, {
    set_default: function set_default( key, value ) { this[ key ] = value; },
    something_private: { value: function something_private() {}, enumerable: false }
  });

});

// Use the "constructor" property to set a default
module.Constructor.set_default( 'key', 'value' );

// Create new instance
var Instance = new module.Constructor();