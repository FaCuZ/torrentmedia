/**
 * Abstract Module API Tests
 *
 * Test the module API.
 *
 * mocha test/api.js --reporter list --ui exports --watch
 *
 * @type {*}
 */
module.exports = {

  "before": function() {
    module.Abstract = require( '../' );
    require( 'should' );
  },

  "Abstract API": {

    "settings": {

      "can be used at module level.": function() {
        module.Abstract.set( 'test', 'value' );
        module.Abstract.get( 'test' ).should.equal( 'value' );
      },

      "can be used at model level.": function() {

        var TestModel = require( '../' ).createModel( function TestModel() {
          this.set( 'module.test', 'module.value' );
          this.get( 'module.test' ).should.equal( 'module.value' );
        });

        TestModel.get( 'module.test' ).should.equal( 'module.value' );

      },

      "can be used at instance level.": function() {

        var Instance = require( '../' ).createModel( function TestModel() {

          this.set( 'module.test', 'module.value' );
          this.get( 'module.test' ).should.equal( 'module.value' );

          this.defineConstructor( function() {
            this.set( 'instance.test', 'instance.value' );
            this.get( 'instance.test' ).should.equal( 'instance.value' );
          });

        }).create();

        Instance.set( 'instance2.test', 'instance2.value' );
        Instance.get( 'instance.test' ).should.equal( 'instance.value' );
        Instance.get( 'instance2.test' ).should.equal( 'instance2.value' );

      },

    },

    "mixin()": function() {

      var target = {
        original: true
      };

      var test = require( '../' ).mixin( target );

      target.should.have.property( 'createModel' );
      target.should.have.property( 'create' );
      target.should.have.property( 'defineProperty' );
      target.should.have.property( 'defineProperties' );

    },

    "call()": function() {

      var target = {
        original: true
      };

      var call = require( '../' ).call( target );

      call.should.be.a( 'object' );
      //call.should.have.property( 'createModel' );
      //call.should.have.property( 'create' );
      //call.should.have.property( 'defineProperty' );
      //call.should.have.property( 'defineProperties' );

    },

    "bind()": function() {

      var target = {
        original: true
      };

      var bind = require( '../' ).bind( target );

      bind.should.be.a( 'function' );
      //target.should.have.property( 'createModel' );
      //target.should.have.property( 'create' );
      //target.should.have.property( 'defineProperty' );
      //target.should.have.property( 'defineProperties' );

    },

    "apply()": function() {

      var target = {
        original: true
      };

      var apply = require( '../' ).call( target );

      apply.should.be.a( 'object' );
      //target.should.have.property( 'createModel' );
      //target.should.have.property( 'create' );
      //target.should.have.property( 'defineProperty' );
      //target.should.have.property( 'defineProperties' );

    },

    "extendPrototype() - creates combined object from multiple prototypes.": function() {

      //console.log( require( 'async' ) );
      var test = require( '../' ).extendPrototype(
        require( 'eventemitter2' ).EventEmitter2.prototype,
        require( 'async' ),
        require( 'net' )
      );

      // EventEmitter Methods
      test.should.have.property( 'emit' );
      test.should.have.property( 'on' );
      test.should.have.property( 'onAny' );

      // Async Methods
      test.should.have.property( 'auto' );
      test.should.have.property( 'series' );
      test.should.have.property( 'queue' );

      // Net Methods
      test.should.have.property( 'Socket' );
      test.should.have.property( 'Stream' );
      test.should.have.property( 'Server' );

    },

    "create() - generates basic Objects.": function() {
      var Abstract = module.Abstract;

      // Create New Object
      var UserModel = { data: Abstract.create( null, {
        name: {
          value: 'User',
          description: 'Model for generating Users.',
          watched: true
        },
        meta: {
          value: {
            age: undefined,
            sex: undefined,
            key: undefined
          },
          description: 'Used for storing majority of user information.'
        },
        identify: {
          value: function identify( say ) { return [ say, this._id, this._type, this._path ]; },
          inheritable: false
        }
      }) };

      if( UserModel.data.name !== 'User' ) {
        throw new Error( 'Abstract.create() not working right.' );
      }

    },

    "createModel()": {

      "has expected methods in the builder": function() {

        module.TestModel = require( '../' ).createModel( function TestModel() {
          this.should.have.property( 'use' );
          this.should.have.property( 'get' );
          this.should.have.property( 'set' );
          this.should.have.property( 'defineConstructor' );
          this.should.have.property( 'defineProperties' );
          this.should.have.property( 'defineProperty' );
          this.custom_constructor_method = function MyMethod() {};
          this.custom_constructor_property = true;
          this.prototype.instance_method = function instance_method() {};
          Object.defineProperty( this, 'hidden_custom', { value: true, enumerable: false });
        });

      },

      "returns a constructor function with expected methods.": function() {
        module.TestModel.should.be.a( 'function' );
        module.TestModel.should.have.property( 'create' );
        module.TestModel.should.have.property( 'custom_constructor_property', true );
        module.TestModel.should.have.property( 'use' );
        module.TestModel.should.have.property( 'get' );
        module.TestModel.should.have.property( 'set' );
      },

      "will expose non-enumerable model properties outside of the context": function() {
        module.TestModel.should.have.property( 'hidden_custom' );
      },

      "can be initialized via new Model and returns expected methods": function() {
        var Instance1 = module.TestModel.create();
        Instance1.should.be.a( 'object' );
        Instance1.should.have.property( 'instance_method' );
        Instance1.instance_method.should.have.property( 'name', 'instance_method'  );
        Instance1.should.have.property( 'constructor' );
        Instance1.should.have.property( 'properties' );
        Instance1.should.have.property( 'get' );
        Instance1.should.have.property( 'set' );
        Instance1.should.have.property( 'use' );
      },

      "can inherit functionality via this.use().": function( done ) {

        var TestModel = require( '../' ).createModel( function TestModel() {
          this.use( require( 'net' ) );
          this.use( require( 'net' ) );
          this.use( require( 'async' ) );
          this.use( require( 'events' ).EventEmitter.prototype );
          this.should.have.property( 'auto' );
          this.should.have.property( 'queue' );
          this.should.have.property( 'on' );
          this.should.have.property( 'emit' );
        }).once( 'done', done );

        TestModel.should.have.property( 'auto' );
        TestModel.should.have.property( 'queue' );
        TestModel.should.have.property( 'on' );
        TestModel.should.have.property( 'emit' );

        TestModel.emit( 'done', null );

      },

      "can inherit module functionality via this.require().": function() {

        var TestModel = require( '../' ).createModel( function TestModel() {

          // Require and include into chain
          this.require( 'net' ) ;
          this.require( 'async' );

          // Should not throw error
          this.require( 'async' );

          // Will not throw an error
          this.require( 'i-do-not-exist-abracadabra' );

          // Include into chain
          this.use( require( 'events' ).EventEmitter.prototype );

          // In-context tests
          this.should.have.property( 'auto' );
          this.should.have.property( 'on' );
          this.should.have.property( 'createServer' );

        });

        // Out of context tests
        TestModel.should.have.property( 'auto' );
        TestModel.should.have.property( 'on' );
        TestModel.should.have.property( 'createServer' );

      },

      "can define instances with this.defineConstructor()": function() {

        var TestModel = require( '../' ).createModel( function TestModel() {
          this.use( require( 'async' ) );
          this.use( require( 'express' ) );

          // Test Async and Express methods in model context
          this.should.have.property( 'auto' );
          this.should.have.property( 'createServer' );

          this.defineConstructor( function create() {
            this.use( require( 'events' ).EventEmitter.prototype );

            // Test Async, Express and now Emitter methods in Instance Constructor
            this.should.have.property( 'auto' );
            this.should.have.property( 'emit' );
            this.should.have.property( 'on' );
            this.should.have.property( 'createServer' );

          });

        });

        //console.log( TestModel.defineConstructor );

        var Instance0 = TestModel.create();

        //console.log( Instance0 );

      },

      "property setting": {

        "[todo] this.properties()": function() {

          // Test seting properties with different values

          // Lazy
          // true
          // false
          // null
          // undefined
          // {}

          // ECMA5
          // { value: true; }
          // { value: false; }
          // { value: null; }
          // { value: undefined; }
          // { value: {}; }

        },

        "[todo] this.defineProperty()": function() {},

        "[todo] this.defineProperties()": function() {},

      }

    },

    "can instantiate Models using": {

      "Model.create()": function() {
        var Abstract = module.Abstract;

        var MyModel = Abstract.createModel( function MyModel( MyModel, prototype ) {
          MyModel.defineProperties( prototype, { make: 'Chevy', model: 'Tahoe' })
          MyModel.defineConstructor( function create( options ) { Abstract.utility.extend( this, options ); });
        });

        var Instance = MyModel.create({ year: 2010, mileage: 40000 });

        Instance.should.be.a( 'object' );
        Instance.should.have.property( 'make', 'Chevy' );
        Instance.should.have.property( 'model', 'Tahoe' );
        Instance.should.have.property( 'year', 2010 );
        Instance.should.have.property( 'mileage', 40000 );

      },

      "new MyModel.create": function() {
        var Abstract = module.Abstract;

        var MyModel = Abstract.createModel( function MyModel( MyModel, prototype ) {
          MyModel.defineProperties( prototype, { make: 'Chevy', model: 'Tahoe' })
          MyModel.defineConstructor( function ConstructorTwo( options ) { Abstract.utility.extend( this, options ); });
        });

        var Instance = new MyModel.ConstructorTwo({ year: 2010, mileage: 40000 });

        Instance.should.be.a( 'object' );
        Instance.should.have.property( 'make', 'Chevy' );
        Instance.should.have.property( 'model', 'Tahoe' );
        Instance.should.have.property( 'year', 2010 );
        Instance.should.have.property( 'mileage', 40000 );

      },

      "Model.custom()": function() {
        var Abstract = module.Abstract;

        var MyModel = Abstract.createModel( function MyModel( MyModel, prototype ) {
          MyModel.defineProperties( prototype, { make: 'Chevy', model: 'Tahoe' })
          MyModel.custom = MyModel.defineConstructor( function ConstructorThree( options ) { Abstract.utility.extend( this, options ); });
        });

        var Instance = MyModel.custom({ year: 2010, mileage: 40000 });

        Instance.should.be.a( 'object' );
        Instance.should.have.property( 'make', 'Chevy' );
        Instance.should.have.property( 'model', 'Tahoe' );
        Instance.should.have.property( 'year', 2010 );
        Instance.should.have.property( 'mileage', 40000 );

      },

      "new Model.custom()": function() {
        var Abstract = module.Abstract;

        var MyModel = Abstract.createModel( function MyModel( MyModel, prototype ) {
          MyModel.defineProperties( prototype, { make: 'Chevy', model: 'Tahoe' })
          MyModel.custom = MyModel.defineConstructor( function ConstructorFour( options ) { Abstract.utility.extend( this, options ); });
        });

        var Instance = new MyModel.custom({ year: 2010, mileage: 40000 });

        Instance.should.be.a( 'object' );
        Instance.should.have.property( 'make', 'Chevy' );
        Instance.should.have.property( 'model', 'Tahoe' );
        Instance.should.have.property( 'year', 2010 );
        Instance.should.have.property( 'mileage', 40000 );

      }

    },

    "can set and store default settings": function() {
      var Abstract = module.Abstract;

      // Set Module Defaults
      Abstract.set( 'defaults', {
        enumerable: true,
        inheritable: true,
        writable: true,
        configurable: true,
        watched: false,
        delayed: false
      });

      Abstract._meta.should.have.property( 'defaults' );
      Abstract._meta.defaults.should.have.property( 'enumerable', true );

    },

    "instantiation honors enumerability settings": function() {

    },

    "handles 'properties' setting": function() {
      var Abstract = module.Abstract;

      // Create dummy user
      var User = Abstract.create( require( 'Faker' ).Helpers.createCard() );

      // Add analyze constructor with constructor properties
      Abstract.defineProperty( User, 'analyze', {
        value: function Analyze() { this.email.should.equal( User.email ); },
        description: 'Analyze the user profile.',
        properties: {
          reduce: function reduce() {
            //console.log( 'reduce', this );
          },
          invoke: function invoke() {}
        }
      })

      //User.analyze();
      User.analyze.reduce();
      User.should.have.property( 'analyze' );
      User.analyze.should.have.property( 'invoke' );
      User.analyze.should.have.property( 'reduce' );

    }

}

}
