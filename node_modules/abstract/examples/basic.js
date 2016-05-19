/**
 *
 *
 * @version 0.1.0
 * @class Abstract
 * @constractor
 */
var BasicConstructor = require( 'abstract' ).model( function() {

  // Use the Events module
  this.use( require( 'events' ).prototype );

  // Predefine Default property descriptions
  this.set( 'meta.property.defaults' );

  // Define Constructor Properties using defineProperty semantics or by simply provoding a value
  this.properties( this, {
    set_default: function set_default( key, value ) { this[ key ] = value; },
    something_private: { value: function something_private() {}, enumerable: false }
  });

  this.instance( function() {

    // <-- This is the Instance constructor

  });

});

// Use the "constructor" property to set a default
BasicConstructor.set_default( 'key', 'value' );

// Create new instance
var Instance = BasicConstructor.create();

