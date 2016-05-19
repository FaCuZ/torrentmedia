/**
 * Create custom objects and methods by aggregating and abstracting esources.
 *
 * @version 0.1.0
 * @class Settings
 * @constractor
 */
require( 'abstract' ).createModel( module.exports = function Settings( exports ) {

  // Construct Model only once.
  if( module.loaded ) {
    return Settings;
  }

  var util        = require( 'util' );
  var inherits    = require( 'util' ).inherits;
  var _extend     = require( 'abstract' ).utility.extend;
  var _unwrap     = require( 'abstract' ).utility.unwrap;

  // Constructor Properties
  Settings.defineProperties( Settings, {
    inject: {
      /**
       * Force / Override properties
       *
       * If object not provided will bind to context.
       *
       * @param {Object} obj
       * @return {Object}
       */
      value: function inject( obj, property ) {

        var Instance = new Settings.create();

        if( !obj ) {
          obj = this;
        }

        //console.log( 'property', typeof obj[ property ] );

        Object.getOwnPropertyNames( Settings.prototype ).forEach( function( key ) {

          var descriptor = Object.getOwnPropertyDescriptor( obj, key );

          Object.defineProperty( obj, key, {
            value: Instance[ key ],
            enumerable: descriptor ? descriptor.enumerable : false,
            writable: true,
            configurable: true
          });

        });

        if( property && 'object' === typeof obj[ property ] ) {
          Instance.set( obj[ property ] );
        }

        // Ensure we have an listener container.
        if( !obj._events ) {

          Object.defineProperty( obj, '_events', {
            value: {},
            enumerable: true,
            configurable: true,
            writable: true
          });

        }

        return obj;

      },
      enumerable: true,
      configurable: true,
      writable: true
    },
    mixin: {
      /**
       * Mixin the Emitter properties.
       *
       * @param {Object} obj
       * @return {Object}
       */
      value: function mixin( obj ) {

        for( var key in Settings.prototype ) {

          var descriptor = Object.getOwnPropertyDescriptor( obj, key );

          // Detect if a property is not configurable.
          if( descriptor && !descriptor.configurable ) {
            break;
          }

          try {

            Object.defineProperty( obj, key, {
              value: obj[ key ] || Settings.prototype[ key ],
              enumerable: false,
              writable: true,
              configurable: true
            });

          } catch( error ) {}

        }

        // Ensure we have an listener container.
        if( !obj._events ) {

          Object.defineProperty( obj, '_events', {
            value: {},
            enumerable: true,
            configurable: true,
            writable: true
          });

        }

        return obj;

      },
      enumerable: true,
      configurable: true,
      writable: true
    },
    version: {
      value: require( '../package' ).version,
      enumerable: true,
      configurable: true,
      writable: true
    }
  });

  // Prototypal Properties
  Settings.properties( Settings.prototype, {

    /**
     * Get or create and get storage
     *
     * Recognized Express application context and forwards to this._router.
     *
     * @param key {String}
     * @param fallback {Function}
     * @returns {*|undefined}
     */
    get: function get( key, fallback ) {
      var self = this;
      var args = Array.prototype.slice.call( arguments );

      // Support Express Application "get" method.
      if( 'function' === typeof arguments[1] && 'object' === typeof this._router ) {

        // if no router attached yet, attach the router
        if( !this._usedRouter ) {
          this.use( this.router );
        }

        // setup route
        this._router[ key ].apply( this._router, arguments );

        return this;

      }

      // Create object meta if it does not exist
      if( !this._meta ) {
        Object.defineProperty( this, '_meta', {
          value: {},
          enumerable: false,
          writable: true,
          configurable: true
        });
      }

      // Return empty full meta object if no key specified
      if( 'undefined' === typeof key ) {
        return this._meta || {};
      }

      var value = require( 'abstract' ).utility.query( this._meta, arguments[0] );

      // Return the found value or the fallback value
      return value || fallback;

    },

    /**
     * Set Key & Value pair, or pass an object
     *
     * @method key
     * @param key {String|Object}
     * @param value {Any}
     * @returns {Object} Context.
     */
    set: function set( key, value ) {
      var self = this;
      var args = Array.prototype.slice.call( arguments );

      // Create object meta if it does not exist
      if( !this._meta ) {
        Object.defineProperty( this, '_meta', {
          value: {},
          enumerable: false,
          writable: true,
          configurable: true
        });
      }

      // Not passing any arguments can be used to instantiate
      if( !arguments ) {
        return this;
      }

      // Key & Value Passed
      if( Object.keys( arguments ).length === 2 && ( 'string' === typeof arguments[0] || 'number' === typeof arguments[0] ) ) {

        // Honor dot notation
        _unwrap( arguments[0], arguments[1], this._meta );

        if( 'function' === typeof self.emit ) {
          self.emit( [ 'set', arguments[0] ].join( '.' ), null, arguments[1], arguments[0] );
        }

      }

      // Object Passed, extend
      if( Object.keys( arguments ).length === 1 && 'object' === typeof arguments[0] ) {

        _extend( this._meta, arguments[0] );

        if( 'function' === typeof self.emit ) {

          // @todo Get object path using dot notation, only goes two levels deep right now for emitting.
          for( var _key in args[0] ) {

            if( args[0][ _key  ] ) {

              // console.log( 'emitting', [ 'set', _key  ].join( '.' ), args[0][_key ] );
              self.emit( [ 'set', _key  ].join( '.' ), null, args[0][_key ], _key  );

              if( 'object' === typeof args[0][_key ] ) {

                for( var __key  in args[0][_key ] ) {
                  // console.log( 'emitting', [ 'set', _key , __key  ].join( '.' ),  args[0][_key ][__key ]);
                  self.emit( [ 'set', _key, __key  ].join( '.' ), null, args[0][_key ][__key ], [ _key , __key  ].join( '.' ) );
                }

              }


            }

          }

        }

      }

      return this;

    },

    /**
     * Enable an Option
     *
     * @param key
     */
    enable: function enable( key ) {

      if( !this._meta ) {
        Object.defineProperty( this, '_meta', {
          value: {},
          enumerable: false,
          writable: true,
          configurable: true
        });
      }

      this._meta[ key ] = true;

    },

    /**
     * Disable an Option
     *
     * @param key
     * @returns {boolean}
     */
    disable: function disable( key ) {
      return this._meta ? this._meta[ key ] = false : null;
    }

  });

  // Define instance constructor and bind to module.exports
  Settings.defineConstructor( function( defaults ) {
    this.set( defaults );
  });

});

