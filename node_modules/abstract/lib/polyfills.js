/**
 * -
 *
 * -
 *
 * @author potanin
 * @date 7/5/13
 */
module.exports = {
  /**
   * Add Object.setPrototypeOf()
   *
   * @source: https://gist.github.com/WebReflection/5593554#file-object-setprototypeof-js
   *
   * @param Object
   * @param magic
   * @returns {Function}
   */
  setPrototypeOf: function setPrototypeOf( Object, magic ) {
    var set;

    function checkArgs( O, proto ) {
      if( typeof O !== 'object' || O === null ) {
        throw new TypeError( 'can not set prototype on a non-object' );
      }
      if( typeof proto !== 'object' && proto !== null ) {
        throw new TypeError( 'can only set prototype to an object or null' );
      }
    }

    function setPrototypeOf( O, proto ) {
      checkArgs( O, proto );
      set.call( O, proto );
      return O;
    }

    try {
      // this works already in Firefox and Safari
      set = Object.getOwnPropertyDescriptor( Object.prototype, magic ).set;
      set.call( {}, null );
    } catch( o_O ) {
      if( Object.prototype !== {}[magic] ) {
        // IE < 11 cannot be shimmed
        return;
      }
      set = function( proto ) {
        this[magic] = proto;
      };

      setPrototypeOf.polyfill = setPrototypeOf( setPrototypeOf( {}, null ), Object.prototype ) instanceof Object;

    }

    return setPrototypeOf;

  }
};