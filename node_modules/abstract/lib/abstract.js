/**
 * Create custom objects and methods by aggregating and abstracting esources.
 *
 * @version 0.0.1
 * @module abstract
 * @constractor
 */
function Abstract() {

  // Create Model Builder context
  if( 'function' === typeof arguments[0] ) {
    return Abstract.createModel( arguments[0] );
  }

  // Create Plain object
  if( 'object' === typeof arguments[0] ) {
    return Abstract.create( arguments[0], arguments[1] );
  }

  // Return for context
  return this;

}

/**
 * Constructor Properties
 *
 * The following properties are available within the constructor factory or by
 * referencing the constructor.
 *
 */
Object.defineProperties( module.exports = Abstract, {
  get: {
    /**
     * Get a key from current context's _meta
     *
     * @todo Migrate to use object-settings once Abstract core is ready.
     * @temp
     * @param key
     * @returns {Function}
     */
    get: function() {
      return function get() {
        return require( 'object-settings' ).prototype ? require( 'object-settings' ).prototype.get.apply( Abstract, arguments ) : Abstract.utility.noop();
      }
    },
    configurable: true,
    enumerable: false
  },
  set: {
    /**
     * Set a key and value to current's context's _meta
     *
     * @todo Migrate to use object-settings once Abstract core is ready.
     * @temp
     * @param key
     * @param value
     * @returns {Function}
     */
    get: function() {
      return function set() {
        return require( 'object-settings' ).prototype ? require( 'object-settings' ).prototype.set.apply( Abstract, arguments ) : Abstract.utility.noop();
      }
    },
    configurable: true,
    enumerable: false
  },
  mixin: {
    /**
     *
     * @returns {Function}
     */
    value: function( obj ) {

      var target = obj || this;

      Object.keys( Abstract ).forEach( function( key ) {
        target[ key ] = target[ key ] || Abstract[ key ];
      });

      return target;

    },
    configurable: true,
    enumerable: false
  },
  apply: {
    /**
     * Instantiate within a custom context.
     *
     * @params target {Object} Target object to use as the context.
     * @params arguments {Object} Arguments to instantiate with.
     * @returns {Function}
     */
    get: function() {
      return function apply( target, arguments ) {
        return Abstract.prototype.mixin( target, target );
      }
    },
    configurable: true,
    enumerable: false
  },
  create: {
    /**
     * Creates a new object with the specified prototype object and properties.
     * Copy the functions from the superclass prototype to the subclass prototype.
     *
     * @param proto {Object|null} Superclass to use as prototype for new object.
     */
    value: function create( proto, properties ) {

      // If first argument is a method, assume we are making a model
      if( 'function' === typeof proto ) {
        return Abstract.createModel( proto, properties );
      }

      var Instance = Object.create( proto );

      Abstract.defineProperties( Instance, properties );

      // Return for context
      return Instance;

    },
    configurable: true,
    writable: false,
    enumerable: true
  },
  createModel: {
    /**
     * Create Model Environment
     *
     * This method expects a function to be passed to be used as the Model Builder.
     * Within the context of the Model Builder new methods become available.
     *
     * Removed for now:
     * Abstract.copyProperties( Model.create, Model );
     * Abstract.addPrototype( Model.create, Model );
     *
     */
    value: function createModel( Model ) {
      // console.log( 'createModel' );

      // Call Constructor, pass in some arguments maybe
      if( 'function' !== typeof Model ) {
        return new Error( 'Abstract.createModel() requires a callable method as the first argument.' );
      }

      if( Model.is_constructed ) {
        //return Model.create();
      }

      // If Instantiator already bound
      if( 'function' === typeof Model.create && model.create.name === 'createInstance' ) {
        return Model.create;
      }

      // Create dynamically-created Model Constructor context
      Abstract.defineProperties( Model, {
        use: {
          value: Abstract.prototype.use.bind( Model ),
          configurable: true,
          enumerable: false,
          writable: true
        },
        require: {
          value: Abstract.prototype.require.bind( Model ),
          configurable: true,
          writable: true,
          enumerable: false
        },
        get: {
          value: Abstract.prototype.get.bind( Model ),
          configurable: true,
          enumerable: false,
          writable: true
        },
        set: {
          value: Abstract.prototype.set.bind( Model ),
          configurable: true,
          enumerable: false,
          writable: true
        },
        properties: {
          value: Abstract.prototype.properties.bind( Model ),
          configurable: true,
          enumerable: false,
          writable: true
        },
        defineConstructor: {
          value: Abstract.defineConstructor.bind( Model, Model ),
          configurable: true,
          enumerable: false,
          writable: true
        },
        defineProperties: {
          value: Abstract.defineProperties.bind( Model ),
          configurable: true,
          enumerable: false,
          writable: true
        },
        defineProperty: {
          value: Abstract.defineProperty.bind( Model ),
          configurable: true,
          enumerable: false,
          writable: true
        }
      });

      // Create Instance Prototype from Abstract Prototype
      Model.prototype = Object.create( Abstract.prototype );

      // Instantiation Method
      Object.defineProperty( Model, 'create', {
        value: function createInstance() { return Abstract.createInstance.apply( Model, arguments ); },
        enumerable: true,
        configurable: true,
        writable: true
      })

      // Run Builder in Model context
      Model.call( Model, Model, Model.prototype );

      // Set custom name for creating method if available
      var _custom_name = undefined;

      if( Model._instantiator && Object.keys( Model._instantiator ).length ) {
        Model._instantiator.forEach( function( fn ) { _custom_name = fn.name || _custom_name; });
      }

      // Context wrapper for instantiation
      if( _custom_name && 'string' === typeof _custom_name ) {

        Object.defineProperty( Model, _custom_name, {
          value: Model.create,
          enumerable: true,
          configurable: true,
          writable: true
        });

        // Hide "create()" since we have a cool custom name
        Object.defineProperty( Model, 'create', {
          enumerable: false
        })

      }

      // Mark model as constructred
      Object.defineProperty( Model, 'is_constructed', {
        value: Model.name,
        enumerable: false,
        configurable: true,
        writable: true
      });

      // Return constructor function
      return Model;

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  copyProperties: {
    /**
     * Iterate through target's properties and reference them into the source object
     *
     * @param target {Object}
     * @param source {Object}
     * @returns {Object} Target object.
     */
    value: function referenceProperties( target, source ) {

      Object.getOwnPropertyNames( source ).forEach( function( key ) {
        var descriptor = Object.getOwnPropertyDescriptor( source, key );

        if( descriptor.enumerable ) {
          Object.defineProperty( target, key, {
            enumerable: true,
            value: source[ key ],
            writable: descriptor.writable,
            configurable: descriptor.configurable
          });
        }

      });

      return target;

    },
    configurable: true,
    enumerable: false,
    writable: true
  },
  createInstance: {
    /**
     * Create Instance
     *
     * It's rather imperative that this method be run in context.
     *
     * @returns {*}
     */
    value: function createInstance() {
      // console.log( 'createInstance' );

      var args = arguments;

      // Create the instance
      var Instance = Object.create( this.prototype );

      // Not very elegant... @todo Revise prototype chain logic if this causes issues.
      for( var key in this.__proto__ ) {

        // Only check own properties of model for inheritence; all "use()'d" properties will be non-enumerable
        var is_enumerable = this.propertyIsEnumerable( key );

        Object.defineProperty( Instance, key, {
          value: this.__proto__[key],
          enumerable: is_enumerable,
          writable: true,
          configurable: true
        });
      }

      // Set instance ID and Schema scaffolding
      Instance.set({
        id: Abstract.utility.hash( null, { random: true }),
        model: this.name || 'Model',
        schema: {
          id: [ '#', Instance.get( 'id' ) || this.name || 'Model' ].join( '' ),
          type: 'object',
          properties: {}
        }
      });

      // Call createInstance
      if( this._instantiator && Object.keys( this._instantiator ).length ) {
        this._instantiator.forEach( function( fn ) { fn.apply( Instance, args ); });
      }

      return Instance;

    },
    configurable: true,
    enumerable: false,
    writable: true
  },
  defineConstructor: {
    /**
     * Bind createInstance to Context
     *
     * @method defineConstructor
     * @param target
     * @param fn
     */
    value: function defineConstructor( target, fn ) {
      // console.log( 'defineConstructor' );

      if( target._instantiator && Object.keys( target._instantiator ).length ) {
        target._instantiator.push( 'function' === typeof fn ? fn : Abstract.utility.noop );
        return target;
      }

      Object.defineProperty( target, '_instantiator', {
        value: [ 'function' === typeof fn ? fn : Abstract.utility.noop ],
        configurable: true,
        enumerable: false,
        writable: true
      });

      // Set instantiator using custom name
      if( fn.name !== 'create' ) {

        Object.defineProperty( target, fn.name, {
          get: function() { return target.create; },
          enumerable: true,
          configurable: true
        });

      }

      // Context wrapper for instantiation
      return function createInstance() {
        return Abstract.createInstance.apply( target, arguments );;
      }

    },
    configurable: true,
    enumerable: false,
    writable: true
  },
  defineProperties: {
    /**
     * Configure multiple object properties.
     *
     * @param obj
     * @param props
     * @returns {*}
     */
    value: function defineProperties( target, props ) {

      if( !props && 'object' === typeof props && this.hasOwnProperty( 'defineConstructor' ) ) {
        props = target;
        target = this;
      }

      if( !props || 'object' !== typeof props ) {
        return target || {};
      }

      Object.keys( props ).forEach( function( key ) {
        Abstract.defineProperty( target, key, props[ key ] );
      });

      return target;
    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  defineProperty: {
    /**
     * Configure single object property.
     *
     * @param obj
     * @param key
     * @param prop
     * @returns {*}
     */
    value: function defineProperty( obj, key, prop ) {

      // @issue https://github.com/UsabilityDynamics/abstract/issues/2
      if( !prop ) {

        // If "obj" was omitted we assue we are binding to context
        if( 'string' === typeof obj && 'object' === typeof key && this.hasOwnProperty( 'defineConstructor' ) ) {
          obj = this;
          key = obj;
          prop = key;
        } else {
          prop = {};
        }

      }

      if( !obj ) {
        obj = {};
      }

      // Handle Abstract instances because they have a get and set method inherited form Object Settings
      if( prop instanceof Abstract && prop.get && prop.set && prop._meta ) {

        prop = {
          value: prop,
          configurable: true,
          writable: true,
          type: typeof prop,
          enumerable: true
        }

      }

      // General Descriptors for basic data
      if( 'object' !== typeof prop || ( !prop.get && !prop.set && !prop.value ) ) {

        if( prop.value ) { prop = prop.value; }

        prop = {
          value: prop,
          configurable: true,
          writable: true,
          type: typeof prop,
          enumerable: true
        }

      }

      // Apply Defaults
      Abstract.utility.extend( prop, this.meta ? this.meta.get( 'defaults' ) : {} );

      // Store in Schema and add to Object actual
      try {
        Object.defineProperty( obj, key, prop );
      } catch( error ) {

        switch( error.type ) {

          case 'redefine_disallowed':
            console.error( 'Cannot redefine [%s] property %s', key, obj.name ? 'for [' + obj.name + '] model' : '' );
          break;

          default:
            console.error( error.message );
          break;
        }

      }

      if( obj._meta && obj._meta.schema ) {
        obj._meta.schema[ key ] = prop;
      }

      // Handle constructor property
      if( key === 'constructor' ) {}

      // Handle prototypal properties
      if( key === 'prototype' ) {}

      // Handle __proto__ property
      if( key === '__proto__' ) {}

      // Monitor a Property.
      if( prop.hasOwnProperty( 'watch' ) ) {
        // Abstract.utility.watch( prop, this.watcher ); // @todo Not sure which function to pipeline to.
      }

      // Wrap the property into a getter and setter
      if( prop.hasOwnProperty( 'wrap' ) ) {
        // @todo
      }

        // Add Properties to (presumably) constructor.
      if( prop.hasOwnProperty( 'properties' ) ) {
        Abstract.utility.each( prop.properties, function( fn, key, array ) {
          if( 'function' === typeof prop.value ) {
            Object.defineProperty( prop.value, key, {
              value: fn,
              configurable: true,
              enumerable: true
            });
            //Abstract.use( fn, obj );
          }
        });
      }

      return obj;

    },
    configurable: true,
    enumerable: true
  },
  addPrototype: {
    /**
     * Allow Prototype useage method to be ran in custom context for static calls
     *
     * @returns {Function}
     */
    get: function() {
      return function( context, proto ) {
        return Abstract.prototype.use.call( context, proto );
      }
    },
    configurable: false,
    enumerable: false
  },
  getPropertyDescriptors: {
    /**
     * Allow Prototype useage method to be ran in custom context for static calls
     *
     * @returns {Function}
     */
    value: function getPropertyDescriptors( target, options ) {

      var _extend = require( 'util' )._extend;

      options = _extend({
        include_inherited: false,
        default_descriptor: {
          writable: true,
          enumerable: true,
          configurable: true
        }
      }, options );

      var response = {}

      for( var key in target ) {

        if( Object.getOwnPropertyDescriptor( target, key ) ) {
          response[ key ] = Object.getOwnPropertyDescriptor( target, key );
        } else {

          if( options.include_inherited ) {
            response[ key ] = _extend( options.default_descriptor, { value: target[key] });
          }

        }
      }

      return response;

    },
    configurable: false,
    enumerable: false
  },
  extendPrototype: {
    /**
     * Allow Prototype useage method to be ran in custom context for static calls
     *
     * @returns {Function}
     */
    value: function extendPrototype() {
      var result = {};
      var list = arguments;

      Object.keys( arguments ).forEach( function( index ) {
        //Abstract.utility.extend( result, list[index] );
        //Abstract.utility.extend( result, Object.create( list[index] ) );

        if( index == 0 ) {
          result.__proto__ = list[index];
        } else {
          var depth = result;

          for( i=1; i<=index; i++ ) {
            depth = depth.__proto__;
          }

          depth.__proto__ = list[index];

        }

      });

      // Get immediate prototype
      return Abstract.getPrototypeOf( result );

    },
    configurable: false,
    enumerable: false,
    writable: true
  },
  getPrototypeOf: {
    /**
     * Cross Browser Compatible prototype getter.
     *
     * @param obj
     */
    value: function getPrototypeOf( obj ) {
      if( Object.getPrototypeOf ) {
        return Object.getPrototypeOf( obj ) || undefined;
      } else if( obj.__proto__ ) {
        return obj.__proto__ || undefined;
      } else if( obj.constructor.prototype ) {
        return constructor.prototype || undefined;
      } else {
        return undefined;
      }
    },
    configurable: true,
    enumerable: false,
    writable: true
  },
  setPrototypeOf: {
    /**
     * Basic Wrapper - will be more fault-tolerant in future.
     *
     * @param obj
     * @param proto
     */
    value: function setPrototypeOf( obj, proto ) {
      if( Object.setPrototypeOf ) {
        Object.setPrototypeOf( obj, proto );
      } else if( obj.__proto__ ) {
        obj.__proto__ = obj;
      }
      return obj;
    },
    configurable: true,
    enumerable: false,
    writable: true
  },
  utility: {
    value: require( './utility' ),
    configurable: true,
    enumerable: false,
    writable: true
  },
  version: {
    value: require( '../package' ).version,
    enumerable: false,
    writable: false,
    configurable: false
  }
});

/**
 * Instance Properties
 *
 * The follow properties are available to each instance created from a constructor.
 * Some of the Abstract Static methods reference the prototypal methods.
 * Prototyal methods all work with the existing context.
 *
 */
Object.defineProperties( Abstract.prototype, {
  get: {
    /**
     * Get a key from current context's _meta
     *
     * @todo Migrate to use object-settings once Abstract core is ready.
     * @temp
     * @param key
     * @returns {Function}
     */
    get: function() {
      return function get() {
        return require( 'object-settings' ).prototype ? require( 'object-settings' ).prototype.get.apply( this, arguments ) : Abstract.utility.noop();
      }
    },
    configurable: true,
    enumerable: true
  },
  set: {
    /**
     * Set a key and value to current's context's _meta
     *
     * @todo Migrate to use object-settings once Abstract core is ready.
     * @temp
     * @param key
     * @param value
     * @returns {string}
     */
    get: function() {
      return function set() {
        return require( 'object-settings' ).prototype ? require( 'object-settings' ).prototype.set.apply( this, arguments ) : Abstract.utility.noop();
      }
    },
    configurable: true,
    enumerable: true
  },
  use: {
    /**
     * Inserts an object/prototype into a target object.
     *
     * @todo Try using in some instances.
     * require( 'util' ).inherits( this, source );
     *
     * @param target
     * @param proto
     * @returns {*}
     */
    value: function use( source ) {

      // @todo Implement to mock util.inherts()
      /*
      Object.defineProperty( 'super_', {
        value: source,
        enumerable: false,
        configurable: false,
        writable: true
      });
      */

      // Check if already required to prevent Cyclic __proto__ error.
      if( 'function' === typeof source && source.name && this.get( 'required.' + source.name ) ) {
        return this;
      }

      try {

        // Move current immediate prototype object into new protototype object
        source.__proto__ = this.__proto__;

        // Insert new prototype into chain.
        this.__proto__ = source;

        // Note required
        if( 'function' === typeof source && source.name ) {
          this.set( 'required.' + source.name, true );
        }

      } catch( error ) {
        //console.error( error.message );
        if( error.message === 'Cyclic __proto__ value' ) {}
      }

      return this;

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
     * @param target
     * @param source
     */
    get: function() {
      return require( './utility' ).mixin.bind( this, this );
    },
    configurable: true,
    enumerable: false
  },
  require: {
    /**
     * Requires and inserts an object/prototype into this context object.
     *
     * @example
     *
     *    require( 'abstract' ).createModel( function MyAbstraction( model ) {
     *
     *      this.require( 'util' );
     *      this.require( 'async' );
     *
     *      this.auto({}); // -> [Function]
     *
     *    });
     *
     * @todo Try using in some instances.
     *    require( 'util' ).inherits( this, source );
     *
     * @param name {String} Module name or file path to require.
     * @returns {*}
     */
    value: function use( name ) {

      if( 'string' === typeof name ) {

        try {

          // Resolve module
          require.resolve( name );

          // Check if already required to prevent Cyclic __proto__ error.
          if( this.get( 'required.' + name ) ) {
            return this;
          }

          var source = require( name );

        } catch( error ) { var source = null }

      }

      if( !source ) {
        return this;
      }

      try {

        // Move current immediate prototype object into new protototype object
        source.__proto__ = this.__proto__;

        // Insert new prototype into chain.
        this.__proto__ = source;

        // Add meta note about required source
        this.set( 'required.' + name, true );

      } catch( error ) { console.error( error.message ); }

      return this;

    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  properties: {
    /**
     * Get / Set Properties
     *
     * @returns {Function}
     */
    get: function() {
      return function properties( properties ) {
        if( arguments.length === 1 ) {
          return Abstract.defineProperties( this, arguments[0] );
        } else {
          arguments[0] = arguments[0] || {};
          return Abstract.defineProperties( arguments[0], arguments[1] );
        }
      }
    },
    configurable: true,
    enumerable: false
  }
});



