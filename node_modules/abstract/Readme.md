Abstract.js
-----------

Notice: Under development.

The Abstract library is used for rapidly developing JavaScript prototypal "Models" and "Instances".
Each new Model can be defined by you as needed within a special context which allows you to rapidly 
define complex constructors.

Module Methods
==============
In addition to the Model method, used for creating Prototype models, the module exposes a variety of useful
static methods that can be used outside of the Model context.

    - Abstract.createModel( function MyPrototypeModel() {}): Creates a Model Factory environment.
    - Abstract.create( prototype, properties ): Simple Object creation without a constructor.
    - Abstract.defineProperty( target, property, descriptor ): Add single property.
    - Abstract.defineProperties( target, properties ): Add multiple properties.

In the Abstract.Model example the MyPrototypeModel method is a method in which the actual model is configured.
The above methods are available within the Model Constructor, the "target" attribute is omitted since the
context is set automatically when the methods are called via "this" object.

Module Factory Methods
======================
The below methods are available within the context of an Abstract.createModel( [fn] ) function.

    - this.use( prototype ): Insert target object into current context's context prototype chain.
    - this.require( module ): Require a module and insert it's exports into current context's prototype chain.
    - this.set( key, value ): Set meta key and value, will be used as defaults by instaces.
    - this.get( key ): Get a value.
    - this.defineConstructor( function MyInstanceConstructor() {} ): Creates an Instance Factory environment.
    - this.defineProperty( property, descriptor ): Add single property t othe instance prototype.
    - this.defineProperties( properties ): Add multiple properties to the Instance prototype.

Instance Factory Methods
========================
The Abstract.prototype object contains properties that will be inherited by all Instances created from a Model.
All the default methods listen below are non-enumerable, but any methods you define for the Model will be
enumerable by default, and wil overwrite any default methods.

    - this.use( obj ): Inject external functionality into the context. Uses Abstract.addPrototype within context.
    - this.mixin( obj ): Extends the Instance's prototype into the target object.
    - this.extend( obj ): Extends the target object into the current instance.
    - this.create( args ): Create an instance with provided args.
    - this.set( key, value ): Set meta key and value.
    - this.get( key ): Get key a value.

Property Descriptor Options
===========================
The ECMA5 Object.defineProperty() method allows for advanced property settings, such as enumerability.
The Abstract modules allows for use of additional options in addition to the default options available
via Object.defineProperty().

To review, the standard ECMA5 options are:

    - value: The value associated with the property. Can be any valid JavaScript value (number, object, function, etc) Defaults to undefined.
    - get: A function which serves as a getter for the property, or undefined if there is no getter. The function return will be used as the value of property. Defaults to undefined.
    - set: A function which serves as a setter for the property, or undefined if there is no setter. The function will receive as only argument the new value being assigned to the property. Defaults to undefined.
    - configurable: true if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object. Defaults to false.
    - enumerable: true if and only if this property shows up during enumeration of the properties on the corresponding object. Defaults to false.
    - writable: True if and only if the value associated with the property may be changed with an assignment operator. Defaults to false.

When using Abstract.defineProperty(), Abstract.create() or Abstract.defineProperties() the following options are also available:

    - description: The plain-text description of the property.
    - properties: Sets properties of the "value".
    - watch: Configures the property value as watchable.

The additional options determine the way Model properties are handled and passed down to Instances.
The additional configuration is accessible via {YourObject}.meta.schema object. See Instance Meta section for more information.

    - id: A random hash is generated on instantiation
    - model: Set to the name of the constructor, e.g. "MyPrototypeModel" by default, used to determine "path".
    - schema: Object containing the property schema generated from property descriptors.
    - path: The prototype path to the current instance, e.g. Abstract.MyPrototypeModel.my_instance_id. (The Object.Function is omitted).

Each Module and Instance must have a unique name which will be used to establish namespace and path.
Name will be generated from constructor's name if not specified.

Basic Usage
===========

#### Return Constructor.
Notice location of modul.exports.

    require( 'abstract' ).createModel( function Service( model, prototype ) {

      // Model Logic

      module.exports = this.defineConstructor( function start( name ) {
        console.log( 'Creating Instance', name );
      });

    });

    module.exports( 'Instance1' )
    module.exports( 'Instance2' )

#### Return Model
Notice location of modul.exports.

    require( 'abstract' ).createModel( module.exports = function Service( model, prototype ) {

      // Model Logic

      this.defineConstructor( function create( name ) {
        console.log( 'Creating Instance', name );
      });

    });

    module.exports.create( 'Instance1' );
    module.exports.create( 'Instance2' );

Terminology
===========

  - Model Factory: Method in which you configure the Prototype Constructor and Instance Factory
  - Instance Factory: Method within the Model Factory that is called on every Instance creation.
  - Property Descriptors: Extended property descriptors.

License
=======

(The MIT License)

Copyright (c) 2013 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
