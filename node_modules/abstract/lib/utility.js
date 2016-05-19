/**
 * Helper Utility for Abstract
 *
 * @example
 *
 *    // Select specific methods to load
 *    var my_tools = Abstract.utility( 'if', 'extend', 'flatten', 'unwatch', 'watch' );
 *
 * @for abstract
 * @submodule abstract-utility
 * @author potanin@UD
 * @date 6/17/13
 */
function Utility() {
  return Object.keys( arguments ) ? require( 'lodash' ).pick.apply( null, [ Utility, Array.prototype.slice.call( arguments ) ] ) : Utility;
}

Object.defineProperties( module.exports = Utility, {
  json: {
    value: {
      /**
       * Safely parse JSON
       *
       * @method parse
       * @for Json
       *
       * @param json
       * @return {parsed|json}
       */
      parse: function parse( json ) {

        if( Buffer && json instanceof Buffer ) {
          json = json.toString()
        }

        var parsed = false;
        try {
          parsed = JSON.parse( json );
        } catch( e ) {
          parsed = false;
        }

        // Perhaps try to strip some line braks or special characters..
        if( !parsed && 'string' === typeof json ) {
        }

        return parsed ? parsed : json;
      },
      /**
       *
       * @param obj
       * @returns {boolean}
       */
      stringify: function stringify( obj ) {
        return JSON.stringify( obj );
      },
      pack: function pack() {
      },
      unpack: function pack() {
      }
    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  realpath: {
    value: function realpath() {

      var join_path = require( 'path' ).join;
      var fs = require( 'fs' );

      var _path = arguments.length > 1 ? join_path.apply( {}, arguments ) : arguments[0];

      try {
        return fs.realpathSync( _path );
      } catch( error ) {

        try {
          return require.resolve( _path );
        } catch( error ) {
          return null;
        }
      }

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  console: {
    value: {
      /**
       * Prety Print complex objects
       *
       * @param data
       * @param depth
       *
       * @requires lodash
       * @method console_json
       * @return {Object} The first argument.
       */
      json: function json( data, depth ) {

        try {

          if( 'string' === typeof data && ( 'object' === typeof depth || 'function' === typeof depth ) ) {
            console.log( "\n" + '===============' + data + ' Properties===============' );
            data = depth;
            depth = arguments[2] || 1
          }

          var output = require( 'util' ).inspect( data, false, 'number' === typeof depth ? ( depth - 1 ) : 1, true );

          console.log( output );

        } catch( error ) {
          console.error( 'Error with console.json()', error );
        }

        return arguments[0];

      },
      /**
       * Pretty Print and Object's Methods
       *
       * @param data
       * @param object
       *
       * @requires lodash
       * @method console_methods
       * @return {Object} The first argument.
       */
      method: function method( data, object ) {

        try {

          if( 'string' === typeof data && ( 'object' === typeof object || 'function' === typeof object ) ) {
            console.log( "\n" + '===============' + data + ' Methods===============' );
            data = object;
          }

          module.exports.json( _.methods( data ) );

        } catch( error ) {
          console.error( 'Error with console.methods()', error );
        }

        return arguments[0];

      },
      /**
       * Get all Object Keys
       *
       * @param data
       *
       * @method console_keys
       * @return {Object} The first argument.
       */
      keys: function keys( data ) {

        function Iterate( target ) {
          var result = [];
          for( var key in target ) {
            result.push( key );
          }
          return result;
        }

        console.log( [ Object.keys( data ) + Object.getOwnPropertyNames( data ) + Iterate( data ) ] );
        return data;
      },
      /**
       * Draw data in table style
       *
       * @example
       *
       *    //console.table
       *    console.table([
       *      { .. row .. }
       *    ]);
       *
       *    //console.table
       *    console.table({
       *      'head': [ 'I/O ID', 'Endpoint', 'Description' ],
       *      'colWidths': [ 30, 50, 50 ],
       *      'rows': [
       *        [ 'one', 'two', 'three' ],
       *        [ 'one', 'two', 'three' ]
       *      ]
       *    });
       *
       * @param {object} data
       * @method table
       * @for Utility
       */
      table: function table( data ) {

        try {
          var table = require( 'cli-table' );
        } catch( error ) {
          return console.log( data );
        }

        var rows = [];

        if( _.isObject( data ) && data.rows ) {

          table = new table( {
            'head': data.head || [],
            'colWidths': data.colWidths || []
          } );

          rows = data.rows;

        } else {
          table = new table;
          rows = data;
        }

        _.each( rows, function( row ) {
          if( !_.isEmpty( row ) ) {
            table.push( row );
          }
        } );

        try {
          console.log( table.toString() );
        } catch( error ) {
          //console.trace( error.message, error );
        }

      },
      /**
       * Console a variable report
       *
       * @method report
       * @for Utility
       * @param {object} arguments*
       */
      report: function report() {
        module.exports.console.json.apply( module.exports, arguments );
        module.exports.console.methods.apply( module.exports, arguments );
      }
    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  merge: {
    /**
     * Merge object b with object a.
     *
     * @example
     *     var a = { foo: 'bar' }
     *       , b = { bar: 'baz' };
     *
     *     utils.merge(a, b);
     *     // => { foo: 'bar', bar: 'baz' }
     *
     * @param {Object} a
     * @param {Object} b
     * @return {Object}
     *
     * @source connect
     */
    value: function merge( a, b ) {

      if( a && b ) {
        for( var key in b ) {
          a[key] = b[key];
        }
      }

      return a;

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  embed: {
    /**
     * Shallow Merge of Current Object with Another, and Function Mounting
     *
     * Functions in exact same manner as
     * the Connect utilities "merge" method
     *
     * @param {Object} target
     *
     * @method embed
     *
     * @chainable
     *
     * @return {Object}
     */
    value: function embed( target ) {

      if( 'object' === typeof target || target.keys ) {
        for( var key in target ) {
          this[key] = target[ key ];
        }
      }

      // If second argument is a function, we do some magic
      if( 'function' === typeof target ) {
        return Utility.embed( this );
      }

      return this;

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  regroup: {
    /**
     * Re-group an object by a key, and optionally pick specific keys in the new object.
     *
     * If an object is passed, it is assumed to be grouped, thus flattening the values.
     * Arrays are used as they are.
     *
     * @param target
     */
    value: function regroup( object, group_key, keys ) {

      if( _.isObject( object ) ) {
        object = _.flatten( _.values( object ) );
      }

      function Group( item ) {
        return item[ group_key ];
      }

      if( group_key ) {
        object = _.groupBy( object, Group );
      }

      if( !_.isEmpty( keys ) ) {

        keys = _.isArray( keys ) ? keys : [ keys ];

        _.each( object, function( items, key ) {
          object[ key ] = _.map( items, function( item ) {
            return _.pick( item, keys );
          } )
        } )

      }

      return object;

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  noop: {
    /**
     * Not a function, that's for sure.
     * This method does not accept any arguments.
     */
    value: function noop() {
      // console.log( arguments )
    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  apply: {
    /**
     * Creates a continuation function with some arguments already applied.
     *
     * @uses async
     */
    value: require( 'async' ).apply,
    configurable: true,
    enumerable: true,
    writable: true
  },
  defaults: {
    /**
     * Configure Defaults for an Object
     *
     * Replaces the lodash "defaults" method by including deep-extension.
     *
     * @version 2.0.0
     * @returns {Object}
     */
    value: function defaults() {
      var args = Array.prototype.slice.call( arguments );

      // If no arguments, return empty object
      if( !args[0] && !args[1] ) {
        return {};
      }

      // Ensure target is an object
      args[0] = Object.keys( args[0] || {} ).length ? args[0] : {};

      // Reverse
      args.reverse();

      // Lodash-it
      return require( 'lodash' ).extend.apply( {}, args );

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  watch: {
    /**
     * Watch a Single Property
     *
     * @param {Object} prop
     * @param {callback} handler
     *
     * @method watch
     * @for abstract-utility
     *
     * @chainable
     *
     * @return {Object} newval
     */
    value: function watch( target, prop, handler ) {
      var oldval = target[prop];
      var newval = oldval;
      var description = Object.getOwnPropertyDescriptor( target, prop ) || {};

      switch( typeof target[prop] ) {
        case 'function':
          break;
        case 'object':
          break;
        case 'string':
          break;
        case 'number':
          break;
      }

      // Delete original property and replace with getter/setter if possible
      if( description.configurable === false || !( delete target[ prop ] ) ) {
        return target;
      }

      return Object.defineProperty( target, prop, {
        get: function get() {
          return newval;
        },
        set: function set( val ) {
          oldval = newval;

          // Set value
          newval = val;

          // Execute hander and potentially mody value
          return newval = handler.call( target, prop, oldval, val );

        },
        enumerable: description.enumerable,
        configurable: true
      } );

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  unwatch: {
    /**
     * Unwatch a Single Property
     *
     * @param {Object} prop
     *
     * @method unwatch
     * @for abstract-utility
     *
     * @return null
     */
    value: function unwatch( prop ) {
      var val = this[prop];
      var description = Object.getOwnPropertyDescriptor( this, prop );

      // Shouldn't happen, but just in case.
      if( description.configurable === false || !( delete this[ prop ] ) ) {
        return this;
      }

      this[prop] = val;

      return this;

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  query: {
    /**
     * Get property value using a dot notation path.
     *
     * @param obj
     * @param str
     * @returns {*}
     */
    value: function query( obj, str ) {

      if( !str ) {
        return obj;
      }

      if( 'object' === typeof str ) {
        // @todo Convert Object to dot notation, using the first full dot notation path.
      }

      try {
        return str.split( '.' ).reduce( function( o, x ) {
          return o[x]
        }, obj );

      } catch( error ) {
        return null;
      }

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  unwrap: {
    /**
     * Unwrap dot notation string to nested Object
     *
     * @example
     *
     *    Utility.unwrap( 'first_name', 'john' );  // -> { first_name: 'John' }
     *    Utility.unwrap( 'name.first', 'john' );  // -> { name: { first: 'John' } }
     *    Utility.unwrap( 'first_name' );          // -> null
     *    Utility.unwrap( 'name.first' );          // -> null
     *
     *    // Will not modify object if already exists
     *    Utility.unwrap( 'name.first.fail', 'Anything' );
     *
     * @param string
     * @param value
     * @param hash
     * @param seperator
     * @,etjpd unwrap
     * @return {*}
     */
    value: function unwrap( string, value, hash, seperator ) {
      if( hash == null ) {
        hash = {};
      }
      if( seperator == null ) {
        seperator = '.';
      }
      var parts = string.split( seperator );
      var refHash = hash;
      var depth = 0;

      parts.forEach( function( part ) {
        if( depth == parts.length - 1 ) {
          refHash[part] = value;
        } else {
          if( refHash[part] == null ) {
            refHash[part] = {};
          }
          refHash = refHash[part];
        }

        depth++;

      } );

      return hash;

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  mixin: {
    /**
     * Mixin current prototype into target object
     *
     * Honors property descriptor settings, if available.
     *
     * @param source
     * @param target
     */
    value: function mixin( source, target ) {
      source = this.prototype || arguments[0] || {};
      target = arguments.length == 2 ? arguments[1] : arguments[1] || {};

      for( var key in source ) {

        try {
          Object.defineProperty( target, key, Object.getOwnPropertyDescriptor( source, key ) || {
            value: source[key],
            enumerable: false,
            writable: true,
            configurable: true
          } );
        } catch( error ) {
          console.error( error );
        }

      }

      return target;

    },
    configurable: true,
    writable: true,
    enumerable: false
  },
  inherit: {
    /**
     * Carefully Inherit Properties
     *
     * @param target {Object} Object to add properties to.
     * @param target {Object} Source object.
     * @returns {Object} Extended target.
     */
    value: function inherit( target, source ) {
      target = target || {};
      source = source || {};

      //if( target instanceof source ) {}

      Object.getOwnPropertyNames( source ).forEach( function( key ) {
        if( !target.hasOwnProperty( key ) ) {
          Object.defineProperty( target, key, Object.getOwnPropertyDescriptor( source, key ) );
        }
      } );

      return target;

    },
    enumerable: true
  },
  flatten: {
    /**
     * Flatten Array
     *
     * @todo Notice - nested arrays will not honor delimiter.
     */
    value: function flatten( data, options ) {

      options = Utility.defaults( options, {
        delimiter: 1
      } );

      return Array.prototype.concat( data ).join( options.delimiter ).toLowerCase();

    },
    enumerable: true
  },
  flatten_obj: {
    value: function flatten_obj( obj ) {

      var list = {};

      (function callee( o, r ) {

        r = r || '';

        if( typeof o != 'object' ) {
          return true;
        }

        for( var c in o ) {

          if( callee( o[c], r + "." + c ) ) {

            list[r.substring( 1 ) + "." + c] = o[c]
          }
        }

        return false;

      })( obj );

      return list;
    },
    enumerable: true
  },
  inherit_full: {
    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * Copy of the Node.js util.inherits method.
     *
     * @param {function} target Constructor function which needs to inherit the prototype.
     * @param {function} constructor Constructor function to inherit prototype from.
     */
    value: function inherit_prototype( target, constructor ) {

      target.super_ = constructor;

      target.prototype = Object.create( constructor.prototype, {
        constructor: {
          value: constructor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      } );

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  constructors: {
    /**
     * Walk up the prototype chain, creating a JSON-Schema-esque structure
     *
     * @param context {Object} The object to walk through.
     * @return {Object} JSON Schema-esque constructor chain.
     */
    value: function constructors( context, options ) {
      context = context || {};
      options = options || {};

      var matches = {};
      var path = [];

      do {

        if( context.constructor ) {
          path.push( context.constructor.name );

          Object.defineProperty( matches, context.constructor.name, {
            enumerable: true,
            writable: true,
            value: {
              name: context.constructor.name,
              properties: {
                constructor: {
                  type: typeof context.constructor,
                  properties: Object.getOwnPropertyNames( context.constructor )
                },
                prototype: {
                  type: typeof context.constructor.prototype,
                  properties: Object.keys( context.constructor.prototype )
                }
              }
            }
          } );

        }

      } while( context = Object.getPrototypeOf( context ) );

      if( options.format === 'schema' ) {
        return matches || {};
      }

      if( options.delimiter ) {
        return path.join( options.delimiter );
      }

      return path;

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  unique: {
    /**
     * Return unique values of an array
     *
     * @param array
     * @returns {Array}
     */
    value: function unique( array ) {
      var b = [];
      for( var i = 0; i < array.length; i++ ) {
        if( b.indexOf( array[i] ) == -1 ) b.push( array[i] );
      }
      return b;
    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  hash: {
    /**
     * Generate a unique hash for an Object, using md5 on default.
     *
     * @example
     *
     *    var _hash = Utility.hash({ type: 'some_object', name: 'Bob'});
     *
     *    console.log( _hash ); // -> 147ce3e2ccb7db6b928b303ce42bdafa
     *
     * @param obj {Object} Object to generate a hash for.
     * @param options {Object} options for hash generation.
     * @param options {String} options.type Type of hash to generate, defaulting to md5.
     * @param options {String} options.silent_fail Do not throw errors, return empty string if there was an error when true.
     *
     */
    value: function hash( obj ) {

      var result;
      var string = JSON.stringify( arguments[0] || {} );
      var options = Utility.defaults( arguments[1], {
        type: 'md5',
        silent_fail: true,
        random: false
      } );

      try {

        if( options.random ) {
          string = Math.random().toString();
        }

        result = require( 'crypto' ).createHash( options.type.toLowerCase() ).update( string ).digest( 'hex' );
      } catch( error ) {
        result = options.silent_fail ? '' : error;
      }

      return result;

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  auto: { value: require( 'async' ).auto },
  queue: { value: require( 'async' ).queue },
  times: { value: require( 'async' ).times },
  extend: { value: require( 'deep-extend' ) },
  values: { value: require( 'lodash' ).values },
  map: { value: require( 'lodash' ).map },
  each: { value: require( 'lodash' ).each },
  reduce: {
    value: function reduce( arr, iterator, memo ) {

      if( arr.reduce ) {
        return arr.reduce( iterator, memo );
      }

      _each( arr, function( x, i, a ) {
        memo = iterator( memo, x, i, a );
      } );

      return memo;

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  keys: {
    /**
     *
     * @source async
     */
    value: function keys( obj ) {

      if( Object.keys ) {
        return Object.keys( obj );
      }

      var keys = [];
      for( var k in obj ) {
        if( obj.hasOwnProperty( k ) ) {
          keys.push( k );
        }
      }
      return keys;

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  toArray: { value: require( 'lodash' ).toArray },
  where: { value: require( 'lodash' ).where },
  if: {
    value: {
      "PlainObject": require( 'lodash' ).isPlainObject,
      "Function": require( 'lodash' ).isFunction,
      "Object": require( 'lodash' ).isObject,
      "String": require( 'lodash' ).isString,
    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  log: {
    /**
     * Output variables to console log.
     *
     * Settings can be configured like so:
     *    abstract.log.config.depth = 2;
     *    abstract.log.config.colors = true;
     *
     * @param {Object|String} data A config object
     * @example
     *      Abstract.log( data )
     *
     * method log
     * @return {Object} Abstract constructor.
     * @chainable
     */
    value: Object.defineProperties( function() {

      var output = {};

      // Capture Event Name
      if( this.event ) {
        output.event = this.event;
      }

      Utility.each( arguments, function( item, key ) {

        if( Utility.if.PlainObject( item ) ) {
        }

        output[ 'format' ] = typeof item;

        if( key === 0 ) {
          output[ 'data' ] = item;
        } else {
          output[ key ] = item;
        }

      } );

      console.log( require( 'util' ).inspect( output, ( Utility ).log.config ) );

      return this;
    }, { "config": { value: { "showHidden": true, "depth": 2, "colors": true }, "writable": true } } ),
    enumerable: true
  }
} );