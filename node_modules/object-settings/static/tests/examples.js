/**
 * Basic Object Settings Tests
 *
 * ## Standalone
 * mocha basic --reporter list --ui exports --watch
 *
 * @type {Object}
 */
module.exports = {

  /**
   * Prepare Environment
   *
   */
  'before': function() {
    module.should = require( 'should' );
  },

  "Object Settings Examples": {
    
      "Object basic example works": function() {
        var Example = require( '../../examples/basic' );
        Example.get( 'first_name' ).should.equal( 'John' );;
        Example.get( 'last_name' ).should.equal( 'Adams' );;
        Example.get( 'age' ).should.equal( 42 );;
      },
    
      "Object advanced example works": function() {
        var Example = require( '../../examples/advanced' );
        Example.settings.get( 'some key' ).should.equal( 'some value' );;
      }
      
  }

};