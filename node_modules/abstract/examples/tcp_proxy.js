/**
 * TCP Proxy Example
 *
 * This example demonstrates using a shared Task Queue for all instances.
 * The shared queue is declared in the Model Constructor and is therefore only initialized once.
 *
 * The example also demonstrates shared usage of EventEmitter2 which is also defined once within the Model Constructor.
 *
 * @version 0.1.0
 * @class Abstract
 * @constractor
 */

// Define Task Worker
function TaskWorker( task, fn ) {
  console.log( 'task:', task.type );

  if( task.type === 'create' ) {

    var server = require( 'net' ).createServer( function( socket ) {
      console.log('have connection');
      socket.on('end', function() { console.log('server disconnected'); });
    });

    server.listen( task.from, function() {
      console.log('server started');
      fn( null, server );
    });

  }
}

// Define Model
var TCP_Proxy = require( 'abstract' ).createModel( module.exports = function TCP_Proxy( model ) {

  // Inherit the Events and Async modules into the Model prototype
  model.use( require( 'eventemitter2' ).EventEmitter2.prototype );
  model.use( require( 'async' ) );

  // Set some shared (default) settings
  model.set({
    from: 8000,
    to: 8100
  });

  // Create Task Worker Queue
  model.modelTasks = model.queue( TaskWorker, 2);

  // Define Instance Constructor
  model.defineConstructor( function( id, from, to ) {
    var instance = this;

    // Set Instance Meta
    instance.set({
      id: id,
      from: from,
      to: to
    });

    instance.emit( 'starting', instance );

    // Create connection task
    instance.modelTasks.push({
      type: 'connect',
      from: instance.get( 'from' ),
      to: instance.get( 'from' )
    }, function( error, data ) { console.log( 'server online', error || data ); });

  });

});
