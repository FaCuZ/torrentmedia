/**
 *
 *
 * @version 0.1.0
 * @class Abstract
 * @constractor
 */
var Express = require( 'abstract' ).createModel( function Express() {

  // Use the Events, Express and Async modules
  this.use( require( 'events' ).EventEmitter.prototype );
  this.use( require( 'express' ) );
  this.use( require( 'async' ) );

  console.log( this.emit );
  console.log( this.auto );
  console.log( this.application.post );

  this.defineConstructor( function() {

  });

});

// Create new instance
var Instance = Express.create();

