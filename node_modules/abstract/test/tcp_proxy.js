/**
 * Tests for TCP Proxy Example
 *
 * mocha tcp_proxy.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 7/7/13
 * @type {Object}
 */
return;
module.exports = {

  /**
   * Prepare Environment
   *
   */
  'before': function() {
    require( 'should' );
    module.TCP_Proxy = require( '../examples/tcp_proxy' );
  },

  'Abstract TCP Proxy Example': {

    'starts': function() {

      // Instantiate several TCP Proxies
      new module.TCP_Proxy( 'one', 7000, 8000, function( data ) {
        console.log( data );
      });

      new module.TCP_Proxy( 'two', 7000, 8000, function( data ) {
        console.log( data );
      });

    },

    'triggers events on connections': function( done ) {

      return done();

      // Console TCP Proxy "connect" events from all proxy servers
      module.TCP_Proxy.once( 'starting', function( data ) {
        console.log( this.event, data );
        done();
      });

    }

  }

};