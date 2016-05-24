/**
 * General Object Settings Tests
 *
 * ## Standalone
 * mocha api.js --reporter list --ui exports --watch
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
    module.user = require( 'faker' ).Helpers.userCard;
    module.Settings = require( '../../' );
  },

  "Object Settings API": {

    'has expected properties': function() {
      var ObjectSettings = require( '../../' );
      ObjectSettings.should.have.property( 'create' );
      ObjectSettings.should.have.property( 'use' );
      ObjectSettings.should.have.property( 'mixin' );
    },

    'returns expected properties': function() {

      var Target = module.user();

      // Add Object Settings to a property
      Target.settings = module.Settings.create();

      Target.settings.should.have.property( '_meta' );
      Target.settings.should.have.property( 'get' );
      Target.settings.should.have.property( 'set' );
      Target.settings.should.have.property( 'enable' );
      Target.settings.should.have.property( 'disable' );

    },

    'can create empty instance': function() {

      var Target = module.user();

      Target.settings = module.Settings.create();

      Target.should.have.property( 'settings' );
      Target.settings.should.have.property( 'get' );
      Target.settings.should.have.property( 'set' );
      Target.settings.should.have.property( 'enable' );
      Target.settings.should.have.property( 'disable' );
      Target.settings.should.have.property( '_meta' );
      Target.settings.set( 'name', 'andy' );

      // Settings will be double nested on unbound instances
      Target.settings._meta.should.have.property( 'name', 'andy' );


    },

    'uses to target object': function() {

      var Target = module.user();

      module.Settings.mixin( Target );

      //Target.should.have.property( '_meta' );
      Target.should.have.property( 'get' );
      Target.should.have.property( 'set' );
      Target.should.have.property( 'enable' );
      Target.should.have.property( 'disable' );
      Target.set( 'name', 'andy' );

    },

    'sets data': function() {

      var Target = module.user();
      module.Settings.mixin( Target );

      Target.set( 'color', 'blue' );
      Target.set( 'color2', 'red' );
      Target.set( 'color', 'green' );
      Target.set( { "dasf": "adsf" } );
      Target.set( { "dasf2": { 'asdfdsf': "asdfsdf" } } );

    },

    "supports dot notation": function() {
      var ObjectSettings = require( '../../' );

      // Add values using dot notation
      ObjectSettings.set( 'name.first', 'John' );
      ObjectSettings.set( 'name.last', 'Smith' );

      // Get crated object
      ObjectSettings.get( 'name' ).should.have.property( 'first', 'John' );
      ObjectSettings.get( 'name' ).should.have.property( 'last', 'Smith' );

      // Get by dot notation
      ObjectSettings.get( 'name.first' ).should.equal( 'John' );
      ObjectSettings.get( 'name.last' ).should.equal( 'Smith' );

    },

    'emits events': function( done ) {

      var Target = new ( require( 'eventemitter2' ) ).EventEmitter2( { 'wildcard': true } );

      Target.settings = module.Settings.mixin( Target );

      Target.once( 'set.color', function( error, value, key ) {
        value.should.be.equal( 'blue' );
        key.should.be.equal( 'color' );
        done();
      })

      Target.set( 'color', 'blue' );
      Target.set( 'color2', 'red' );
      Target.set( 'color', 'green' );
      Target.set( { "dasf": "adsf" } );
      Target.set( { "dasf2": { 'asdfdsf': "asdfsdf" } } );

    },

    'can set defaults': function() {
      var Target = module.user();

      module.Settings.mixin( Target );

      Target.set( {
        'color': 'blue',
        'size': 'large'
      } );

      Target.get( 'color' ).should.equal( 'blue' );
      Target.get( 'size' ).should.equal( 'large' );

    },

    'can bind settings to prototype object': function() {

      function Person( name ) {
        this.name = name;
      }

      Person.prototype = {
        'age': 50,
        'run': function() {
        },
        'walk': function() {
        }
      }

      module.Settings.mixin( Person );

      Person.set( 'nothing', 'blah' )

      Person.should.have.property( '_meta' );
      Person._meta.should.have.property( 'nothing' );

      // Bind Settings
      module.Settings.mixin( Person.prototype );

      // Add protoypal setting
      Person.prototype.set( 'height', 72 );

      Person.prototype.should.have.property( 'set' );
      Person.prototype.should.have.property( 'get' );
      Person.prototype.should.have.property( 'enable' );
      Person.prototype.should.have.property( '_meta' );
      Person.prototype._meta.should.have.property( 'height', 72 );

      // Constructor _meta should not be here
      Person.prototype._meta.should.not.have.property( 'nothing' );

      // Create instance
      var Bob = new Person( 'Bob' );

      Bob.should.have.property( 'set' );
      Bob.should.have.property( 'get' );
      Bob.should.have.property( 'enable' );
      Bob.should.have.property( 'age', 50 );
      Bob.should.have.property( '_meta' );

      // Constructor settings should not be here
      Bob._meta.should.not.have.property( 'nothing' );

      // Protoypal setting was inherited
      Bob._meta.should.have.property( 'height', 72 );

    },

  }

};