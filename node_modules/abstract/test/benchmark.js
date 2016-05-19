/**
 * Benchmarking Tests
 *
 * mocha benchmark --reporter list --ui exports --watch
 *
 * @type {*}
 */
module.exports = {

  "before": function() {
    module.Abstract = require( '../' );
    require( 'should' );
  },

  "Abstract": {

    "can create() new Objects and inject multiple prototypes into chain.": function( done ) {

      // Disabled for meow.
      return done();

      var Abstract = module.Abstract;

      // Create New Object,
      var User = Abstract.create( null, require( 'Faker' ).Helpers.createCard() );

      // Add Async and EventEmitter2
      User.use( require( 'async' ) );
      User.use( require( 'events' ).EventEmitter.prototype );

      // Set some EE Options
      User.listenerTree = {};
      User.delimiter = ':';
      User.wildcard = true;

      //User.onAny( function( data ) { console.log( this.event, data ? data : '' ); });
      //User.on( 'acquire:*', function( data ) { console.log( 'AQUISITION!', this.event ); });

      User.on( 'acquire:sugar', function() {
        setTimeout( function() { User.emit( 'have:sugar', null, true ); }, 120 );
      });

      User.on( 'acquire:milk', function() {
        setTimeout( function() { User.emit( 'have:milk', null, true ); }, 50 );
      });

      User.on( 'walk:to_car', function() {
        setTimeout( function() { User.emit( 'in:car', null, true ); }, 100 );
      });

      User.auto({
        milk: function( next ) {
          User.emit( 'acquire:milk' );
          User.once( 'have:milk', next );
        },
        sugar: function( next ) {
          User.emit( 'acquire:sugar' );
          User.once( 'have:sugar', next );
        },
        verify_groceries: [ 'milk', 'sugar', function( next ) {
          User.emit( 'walk:to_car' );
          User.once( 'in:car', next );
        }],
        done_shopping: [ 'verify_groceries', function( next ) {
          User.emit( 'shopping:complete' );
          done();
        }]
      });

    }

  }

}