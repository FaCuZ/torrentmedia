/**
 * Object Normalization / JSON Object
 * ============================+===============
 *
 * Transformation and normalization of a JSON Document, Nested Array, XML Document, or Two Dimensional Table.
 *
 * = Conversions = Can be chained.
 * - Primarily for working with Associative Arrays, e.g. JSON Hash  , being able to transform objects between hashtables and arrays
 * - Strandard transofmration between XML and JSON, using the @ prefix for attributes, etc.
 * - Associative Array / Object conversion to Nested Array Format, and reverals (e.g. Knockout.js Models)
 *
 * = Structure Remapping =
 * - Handle Object Transformations based on a Schema with advanced mapping ruels similar to XPath capabilities
 *
 * = Structure Normalization =
 * - Key Pattern Grouping - Convert 2D objects into nested objects based on patterns, such as common prefix.
 * - Numbered Key Decoupling - Created nested elements from numbered keys. e.g. bedroom1, bedroom2, => { 'bedrooms': [ 'first value', 'second', etc. ] }
 * - Key Normalization - Convert to standard underscore format: de-camel, lowercase, etc.
 *
 * = Value Conversions =
 * - True Data Type - Ensure values have their intended data formats, e.g. converting "5" to 5, "true" to true, etc.
 * - Nullification - Apply rules to convert values between "undefined", "null", "false", etc.
 * - Filtering & Stripping - Removing empty fields and/or empty objects and arrays. Whitespace removal.
 * - Tokenize - Value tokenization. e.g. "my dog hasn't any flees" => [ 'my', 'dog', 'has', 'n\'t', 'any', 'flees', '.' ]
 *
 * = Semantic Conversions = Can be chained.
 * - Singularize / Pluralize -
 * - Change Tense - Future, Present
 * - Ordinalize -
 * - Deordinalize -
 * - Wordize - Convert to printable format. e.g. "my_homes" => "My Home"
 * - Stem - Get stem of a word. e.g. "words" => "word"
 *
 * = Other / Specialized =
 * - Geolocation - Conversion of an address into coordinates.
 * - Categorical Classification
 * - Phoenetics
 *
 * @version 0.1.0
 * @author potanin@UD
 */
module.exports = function( target ) {

  var app = {

    /**
     * Produces an iteration callback bound to an optional `thisArg`. If `func` is
     * a property name, the callback will return the property value for a given element.
     *
     */
    'create_callback': function(func, thisArg) {

      if (typeof func != 'function') {
        return function(object) {
          return object[func];
        };
      }

      if (thisArg !== undefined) {
        return function(value, index, object) {
          return func.call(thisArg, value, index, object);
        };
      }

      return func;

    }

  }

  /**
   * Non-chainable Utility Functions
   *
   * @since 0.2.0
   */
  var _ = {


    /**
     * Creates an object composed of keys returned from running each element of
     * `collection` through a `callback`. The corresponding value of each key is an
     * array of elements passed to `callback` that returned the key. The `callback`
     * is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     * The `callback` argument may also be the name of a property to group by (e.g. 'length').
     *
     * @source Lo-Dash v0.9.2
     */
    'group_by': function(collection, callback, thisArg) {
      var result = {};
      callback = app.create_callback(callback, thisArg);

      _.for_each(collection, function(value, key, collection) {
      key = callback(value, key, collection);
      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
      });

      return result;
    },


    /**
     * Creates an object composed from arrays of `keys` and `values`. Pass either
     * a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`, or
     * two arrays, one of `keys` and one of corresponding `values`.
     *
     * _.object(['moe', 'larry', 'curly'], [30, 40, 50]); // => { 'moe': 30, 'larry': 40, 'curly': 50 }
     *
     * @source Lo-Dash v0.9.2
     */
    'object': function(keys, values) {

      var index = -1,
        length = keys ? keys.length : 0,
        result = {};

      while (++index < length) {

      var key = keys[index];
      if (values) {
        result[key] = values[index];
      } else {
        result[key[0]] = key[1];
      }
      }

      return result;
    },


    /**
     * Converts the `collection`, to an array.
     *
     * (function() { return _.to_array(arguments).slice(1); })(1, 2, 3, 4); // => [2, 3, 4]
     *
     * @source Lo-Dash v0.9.2
     */
    'to_array': function(collection) {

      var noArraySliceOnStrings = slice.call('x')[0] != 'x';

      if (collection && typeof collection.length == 'number') {
      return (noArraySliceOnStrings ? isString(collection) : typeof collection == 'string')
        ? collection.split('')
        : slice.call(collection);
      }
      return values(collection);
    },


    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to but not including `stop`. This method is a port of Python's
     * `range()` function. See http://docs.python.org/library/functions.html#range.
     *
     * @source Lo-Dash v0.9.2
     */
    'range': function(start, end, step) {
      start = +start || 0;
      step = +step || 1;

      if (end == null) {
      end = start;
      start = 0;
      }

      // use `Array(length)` so V8 will avoid the slower "dictionary" mode
      // http://www.youtube.com/watch?v=XAqIpGU8ZZk#t=16m27s
      var index = -1,
        length = Math.max(0, ceil((end - start) / step)),
        result = Array(length);

      while (++index < length) {
      result[index] = start;
      start += step;
      }
      return result;
    },


    /**
     * Array Iterator
     *
     * @lodash forEach requires createIterator() which is too robust to port.
     * @source async
     * @since 0.2.0
     */
    'for_each': function( arr, iterator ) {

      if( arr.for_each ) {
      return arr.for_each(iterator);
      }

      for (var i = 0; i < arr.length; i += 1) {
      iterator(arr[i], i, arr);
      }

    },


    /**
     * Retrieves the value of a specified property from all elements in
     * the `collection`.
     *
     * @source Lo-Dash v0.9.2
     */
    'pluck': function(collection, property) {
      var result = [];

      _.for_each(collection, function(value) {
      result.push(value[property]);
      });

      return result;
    },

    /**
     * Gets the size of the `collection` by returning `collection.length` for arrays
     * and array-like objects or the number of own enumerable properties for objects.
     *
     * @source Lo-Dash v0.9.2
     */
    'size': function(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : _.keys(collection).length;
    },

    /**
     * Checks if `value` is a string.
     *
     *
     * @source Lo-Dash v0.9.2
     */
    'is_string': function(value) {
      return toString.call(value) == stringClass;
    },


    /**
     *
     *
     * @source http://stackoverflow.com/questions/4775722/javascript-check-if-object-is-array
     */
    'is_array': function( item ) {

      if( Object.prototype.toString.call( item ) === '[object Array]' ) {
      return true;
      }

      return false;

    },


    /**
     * Creates a function that is the composition of the passed functions,
     * where each function consumes the return value of the function that follows.
     * In math terms, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
     * Each function is executed with the `this` binding of the composed function.
     *
     * @source Lo-Dash v0.9.2
     */
    'compose': function() {
      var funcs = arguments;

      return function() {
      var args = arguments,
        length = funcs.length;

      while (length--) {
        args = [funcs[length].apply(this, args)];
      }
      return args[0];
      };

    },


    /**
     * Uses a binary search to determine the smallest index at which the `value`
     * should be inserted into `array` in order to maintain the sort order of the
     * sorted `array`. If `callback` is passed, it will be executed for `value` and
     * each element in `array` to compute their sort ranking. The `callback` is
     * bound to `thisArg` and invoked with one argument; (value). The `callback`
     * argument may also be the name of a property to order by.
     *
     * @source Lo-Dash v0.9.2
     */
    'sorted_index': function(array, value, callback, thisArg) {
      var low = 0,
        high = array ? array.length : low;

      // explicitly reference `identity` for better engine inlining
      callback = callback ? app.create_callback(callback, thisArg) : identity;
      value = callback(value);
      while (low < high) {
      var mid = (low + high) >>> 1;
      callback(array[mid]) < value
        ? low = mid + 1
        : high = mid;
      }
      return low;
    },


    /**
     * Gets the index at which the first occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If the `array` is already
     * sorted, passing `true` for `fromIndex` will run a faster binary search.
     *
     * @source Lo-Dash v0.9.2
     */
    'indexOf': function(array, value, fromIndex) {
      var index = -1,
        length = array ? array.length : 0;

      if (typeof fromIndex == 'number') {
      index = (fromIndex < 0 ? Math.max(0, length + fromIndex) : fromIndex || 0) - 1;
      } else if (fromIndex) {
      index = _.sorted_index(array, value);
      return array[index] === value ? index : -1;
      }
      while (++index < length) {
      if (array[index] === value) {
        return index;
      }
      }
      return -1;
    },


    /**
     * Creates an array of values by running each element in the `collection`
     * through a `callback`. The `callback` is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * _.map([1, 2, 3], function(num) { return num * 3; });  // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });  // => [3, 6, 9] (order is not guaranteed)
     *
     * @source Lo-Dash v0.9.2
     */
    'map': function(collection, callback, thisArg) {
      var index = -1,
        length = collection ? collection.length : 0,
        result = Array(typeof length == 'number' ? length : 0);

      callback = app.create_callback(callback, thisArg);

      if(_.is_array(collection)) {

      while (++index < length) {
        result[index] = callback(collection[index], index, collection);
      }

      } else {

      _.for_each(collection, function(value, key, collection) {
        result[++index] = callback(value, key, collection);
      });

      }
      return result;
    },


    /**
     *
     * @source Async
     * @since 0.2.0
     */
    'reduce': function( arr, iterator, memo) {

      if (arr.reduce) {
      return arr.reduce(iterator, memo);
      }

      _.for_each(arr, function( x, i, a) {
      memo = iterator(memo, x, i, a);
      });

      return memo;
    },


    /**
     *
     *
     * @since 0.2.0
     */
    'keys': function( obj) {

      if (Object.keys) {
      return Object.keys(obj);
      }

      var keys = [];
      for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        keys.push(k);
      }
      }

      return keys;

    },


    /**
     * Not Yet Tested at All
     *
     * @source json_path 0.8.0 - XPath for JSON
     * @since 0.2.0
     */
    'json_path': function(obj, expr, arg) {

     var P = {
      resultType: arg && arg.resultType || "VALUE",
      result: [],
      normalize: function(expr) {
         var subx = [];
         return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
              .replace(/'?\.'?|\['?/g, ";")
              .replace(/;;;|;;/g, ";..;")
              .replace(/;$|'?\]|'$/g, "")
              .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
      },
      asPath: function(path) {
         var x = path.split(";"), p = "$";
         for (var i=1,n=x.length; i<n; i++)
          p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
         return p;
      },
      store: function(p, v) {
         if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
         return !!p;
      },
      trace: function(expr, val, path) {
         if (expr) {
          var x = expr.split(";"), loc = x.shift();
          x = x.join(";");
          if (val && val.hasOwnProperty(loc))
           P.trace(x, val[loc], path + ";" + loc);
          else if (loc === "*")
           P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
          else if (loc === "..") {
           P.trace(x, val, path);
           P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
          }
          else if (/,/.test(loc)) { // [name1,name2,...]
           for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
            P.trace(s[i]+";"+x, val, path);
          }
          else if (/^\(.*?\)$/.test(loc)) // [(expr)]
           P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
          else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
           P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
          else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
           P.slice(loc, x, val, path);
         }
         else
          P.store(path, val);
      },
      walk: function(loc, expr, val, path, f) {
         if (val instanceof Array) {
          for (var i=0,n=val.length; i<n; i++)
           if (i in val)
            f(i,loc,expr,val,path);
         }
         else if (typeof val === "object") {
          for (var m in val)
           if (val.hasOwnProperty(m))
            f(m,loc,expr,val,path);
         }
      },
      slice: function(loc, expr, val, path) {
         if (val instanceof Array) {
          var len=val.length, start=0, end=len, step=1;
          loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
          start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
          end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
          for (var i=start; i<end; i+=step)
           P.trace(i+";"+expr, val, path);
         }
      },
      eval: function(x, _v, _vname) {
         try { return $ && _v && eval(x.replace(/@/g, "_v")); }
         catch(e) { throw new SyntaxError("json_path: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
      }
     };

     var $ = obj;

     if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
      P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
      return P.result.length ? P.result : false;
     }

    },


    /**
     *
     *
     * @since 2.0
     * @author potanin@UD
     */
    'array_to_hash_tables': function( array ) {

      var keys = [];
      var values = [];

      _.forOwn( array, function( num, key ) {
        keys.push( _.keys( num ) );
        values.push( _.first( _.values( num ) ) );
      } );

      return _.object( keys, values );
    },

    /**
     *
     *
     * @since 0.2.0
     */
    'extend': function( target ) {

      target = target ? target : {};

      for( var i = 1; i < arguments.length; i++ ) {

      var source = arguments[i];
      var keys = Object.keys( source );

      for( var j = 0; j < keys.length; j++ ) {
        var name = keys[j];

        target[name] = source[name];

      }

      }

      return target
    },

  }

  /**
   * Object and Array Transformations
   *
   * @since 0.2.0
   */
  var _process = {

    /**
     * Enable Debug for rest of chain
     *
     * @since 0.2.0
     */
    'debug': function( object, args ) {
      app.debug = true;
      return object;
    },

    /**
     * Enable Debug For Chain
     *
     * @since 0.2.0
     */
    'dot_notation': function( object, args ) {

      
      return object;
    },

    /**
     * Enable Debug For Chain
     *
     * @source http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
     * @since 0.2.0
     */
    'get_by_path': function( object, path ) { 
      
      function index( obj,i ) {
        return obj[i];
      }
      
      try {
      
        object = path.split( '.' ).reduce( index, object );
        
        return object;
        
      } catch( error ) { debug( error ); }
      
      return object;
      
    },

    /**
     * Batch Items Passed. Second-level items will have the rest of the rules applied.
     *
     * @since 0.2.0
     */
    'batch_items': function( json, args, parsed ) { debug( 'parse()' );


    },

    /**
     * Safelty Parse JSON
     *
     * @since 0.2.0
     */
    'parse': function( json, args, parsed ) { debug( 'parse()' );

      try { parsed = JSON.parse( json ); } catch (error) { parsed = false; }

      return ( typeof parsed === 'object' ? parsed : json );

    },

    /**
     * {}
     *
     * @since 0.2.0
     */
    'clean_object': function( object, args ) { debug( 'clean()' );

      for( i in object ) {

        if( !object[i] && typeof object[i] != 'boolean' ) {
          delete object[i];
        }

        if( object[i] === null ) {
          delete object[i];
        }

        if( typeof object[i] === 'object' ) {

          if( Object.keys( object[i] ).length ) {
            object[i] = _process.clean_object( object[i], args );
          } else {
            delete object[i];
          }

        }

      }

      return object;

    },

    /**
     * {}
     *
     * @since 0.2.0
     */
    'normalize': function( object, args ) { debug( 'normalize()' );

      object.__normalized = true;
      return object;

    },

    /**
     * {}
     *
     * @since 0.2.0
     */
    'nestify': function( object, args ) { debug( 'make_array()' );

      object.__nestify = true;
      return object;

    },

    /**
     * {}
     *
     * @since 0.2.0
     */
    'objectify': function( object, args ) { debug( 'make_object()' );


      return object;

    },

    /**
     * {}
     *
     * @since 0.2.0
     */
    'data_types': function( object, args ) { debug( 'data_types()' );


      return object;

    },

    /**
     * {}
     *
     * @since 0.2.0
     */
    'key_map': function( object, map ) { // console.info( 'common.apply_key_map()' );

      map = map ? map : {};

      if( !_.isEmpty( map ) ) {
      return object;
      }

      var _new = {};

      _.each( object, function( value, key ) {

      if( map[ key ] ) {
        _new[ key ] = value;
      } else {
        _new[ key ] = value;
      }

      });

      return _new;

    },

    /**
     * {}
     *
     * @since 0.2.0
     */
    'group_by_key': function( object, args ) { // console.info( 'common.group_by_key()' );

      args = _.extend( args, {
      'min': 5
      });

      //var _temp = [ 'lfd_', 'lo1_', 'la1_', 'lm_', 'l_address', 'l_keyword', 'l_', 'sa3_', 'list_agent_', 'list_office_', 'alt_agent_', 'alt_office_' ];
      var _temp = [ 'list_agent_', 'list_office_', 'alt_agent_', 'alt_office_' ];

      var _keys = _.keys( object );
      var _grouped = {};

      for( key in object ) {

      for( i in _temp ) {

        var _group_key = _temp[i];
        var _clean_group_key = _group_key.substring( 0, _group_key.length - 1 );

        if( key.toLowerCase().indexOf( _temp[i] ) >= 0 ) {

        _grouped[ _clean_group_key ] = _grouped[ _clean_group_key ] ? _grouped[ _clean_group_key ] : {};
        _grouped[ _clean_group_key ][ key.replace( _group_key, '' ) ] = object[ key ];

        delete object[ key ];

        }

      }

      };

      return _.extend( object, _grouped );

    }

  };

  /**
   * String / Number Transormations
   *
   * @since 0.2.0
   */
  var _string = {

    /**
     * Convert String to Printable Words
     *
     */
    'wordize': function( text ) {

      text = _string.dasherize( text );

      text = text.replace( '-', ' ' );

      text = _string.capitalize( text );

      return text;

    },


    /**
     * {}
     *
     * @since 0.2.0
     */
    'capitalize': function(str) {
      return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
    },


    /**
     * {}
     *
     * @since 0.2.0
     */
    'dasherize': function(str){
      return str.replace(/\s|_/g, '-');
    },


    /**
     * {}
     *
     * @since 0.2.0
     */
    'ordinalize': function(str){
      var isTeen, r, n;
      n = parseInt(str, 10) % 100;
      isTeen = { 11: true, 12: true, 13: true}[n];
      if(isTeen) {return str + 'th'};
      n = parseInt(str, 10) % 10
      switch(n) {
      case 1:
      r = str + 'st';
      break;
      case 2:
      r = str + 'nd';
      break;
      case 3:
      r = str + 'rd';
      break;
      default:
      r = str + 'th';
      }
      return r;
    },


    /**
     * {}
     *
     * @since 0.2.0
     */
    'pluralize': function(str){

      var uncountable = _string.uncountableWords[str.toLowerCase()];

      if (uncountable) {
      return str;
      };

      var rules = [
      [new RegExp('(m)an$', 'gi'),         '$1en'],
      [new RegExp('(pe)rson$', 'gi'),        '$1ople'],
      [new RegExp('(child)$', 'gi'),         '$1ren'],
      [new RegExp('^(ox)$', 'gi'),         '$1en'],
      [new RegExp('(ax|test)is$', 'gi'),       '$1es'],
      [new RegExp('(octop|vir)us$', 'gi'),     '$1i'],
      [new RegExp('(alias|status)$', 'gi'),    '$1es'],
      [new RegExp('(bu)s$', 'gi'),         '$1ses'],
      [new RegExp('(buffal|tomat|potat)o$', 'gi'), '$1oes'],
      [new RegExp('([ti])um$', 'gi'),        '$1a'],
      [new RegExp('sis$', 'gi'),           'ses'],
      [new RegExp('(?:([^f])fe|([lr])f)$', 'gi'),  '$1$2ves'],
      [new RegExp('(hive)$', 'gi'),        '$1s'],
      [new RegExp('([^aeiouy]|qu)y$', 'gi'),     '$1ies'],
      [new RegExp('(matr|vert|ind)ix|ex$', 'gi'),  '$1ices'],
      [new RegExp('(x|ch|ss|sh)$', 'gi'),      '$1es'],
      [new RegExp('([m|l])ouse$', 'gi'),       '$1ice'],
      [new RegExp('(quiz)$', 'gi'),        '$1zes'],
      [new RegExp('s$', 'gi'),           's'],
      [new RegExp('$', 'gi'),            's']
      ];

      for(var i = 0, l = rules.length; i < l; i++){
      if (str.match(rules[i][0])) {
        str = str.replace(rules[i][0], rules[i][1]);
        break;
      };
      }

      return str;
    },


    /**
     * {}
     *
     * @since 0.2.0
     */
    'singularize': function(str){

      var uncountable = _string.uncountableWords[str.toLowerCase()];

      if (uncountable) {
        return str;
      };

      var rules = [
        [new RegExp('(m)en$', 'gi'),                             '$1an'],
        [new RegExp('(pe)ople$', 'gi'),                          '$1rson'],
        [new RegExp('(child)ren$', 'gi'),                          '$1'],
        [new RegExp('([ti])a$', 'gi'),                           '$1um'],
        [new RegExp('((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi'), '$1$2sis'],
        [new RegExp('(hive)s$', 'gi'),                           '$1'],
        [new RegExp('(tive)s$', 'gi'),                           '$1'],
        [new RegExp('(curve)s$', 'gi'),                          '$1'],
        [new RegExp('([lr])ves$', 'gi'),                           '$1f'],
        [new RegExp('([^fo])ves$', 'gi'),                          '$1fe'],
        [new RegExp('([^aeiouy]|qu)ies$', 'gi'),                       '$1y'],
        [new RegExp('(s)eries$', 'gi'),                          '$1eries'],
        [new RegExp('(m)ovies$', 'gi'),                          '$1ovie'],
        [new RegExp('(x|ch|ss|sh)es$', 'gi'),                        '$1'],
        [new RegExp('([m|l])ice$', 'gi'),                          '$1ouse'],
        [new RegExp('(bus)es$', 'gi'),                           '$1'],
        [new RegExp('(o)es$', 'gi'),                             '$1'],
        [new RegExp('(shoe)s$', 'gi'),                           '$1'],
        [new RegExp('(cris|ax|test)es$', 'gi'),                      '$1is'],
        [new RegExp('(octop|vir)i$', 'gi'),                        '$1us'],
        [new RegExp('(alias|status)es$', 'gi'),                      '$1'],
        [new RegExp('^(ox)en', 'gi'),                            '$1'],
        [new RegExp('(vert|ind)ices$', 'gi'),                        '$1ex'],
        [new RegExp('(matr)ices$', 'gi'),                          '$1ix'],
        [new RegExp('(quiz)zes$', 'gi'),                           '$1'],
        [new RegExp('s$', 'gi'),                               '']
      ];

      for(var i = 0, l = rules.length; i < l; i++){
        if (str.match(rules[i][0])) {
          str = str.replace(rules[i][0], rules[i][1]);
          break;
        };
      }

      return str;
    },


    /**
     * {}
     *
     * @since 0.2.0
     */
    'strip': function(str){
      return str.replace(/^\s+/, '').replace(/\s+$/, '');
    },


    /**
     * {}
     *
     * @since 0.2.0
     */
    'underscore': function(str){
      return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
    },


    /**
     * {}
     *
     * @since 0.2.0
     */
    'uncountable': function() {

      var uncountable = {
      'equipment': true,
      'information': true,
      'rice': true,
      'money': true,
      'species': true,
      'series':true,
      'fish':true,
      'sheep':true,
      'moose':true,
      'deer':true,
      'news':true
      };

      for(var i=0,l=arguments.length; i<l; i++){
      _string.uncountable[arguments[i]] = true;
      }

      return _string;
    }

  };

  /**
   * Internal logging function
   *
   * @since 0.1
   */
  var log = function() {

    switch ( true ) {

      case ( arguments[0] instanceof Error ):
      console.error( arguments[0] );
      break;

      default:
      console.log.apply( console, [ '  \u001b[36m', 'Normalize' ].concat( arguments ).concat( [ '\u001b[0m' ] ) );
      break;

    }

    return arguments[0] ? arguments[0] : null;

  };

  /**
   *
   * @author potanin@UD
   */
  var debug = function() {
    return ( app.debug || arguments[0] instanceof Error ? log.apply( this, arguments ) : arguments );
  }

  /**
   * Initialize
   *
   * @todo Use _.compose(); to trigger chained functions.
   * @since 2.0
   * @since 0.2.0
   */
  var init = function( target, arguments ) { // debug( arguments );

    _.extend( app, {
      'debug': false,
      'log': [],
      'stack': [ 'parse' ]
    }, app );

    for( var i = 1, l = arguments.length; i < l; i++ ) {
      app.stack.push( arguments[i] );
    };

    for( i in app.stack ) {
      
      if( typeof app.stack[i] === 'string' ) {        
        var caller = { 'function': app.stack[i], 'args': {} }        
      } else {      
        var caller = { 'function': app.stack[i][0], 'args': app.stack[i][1] }              
      }
      
      this.target = target = ( typeof _process[ caller[ 'function' ] ] === 'function' ? _process[ caller[ 'function' ] ].apply( this, [ target, caller[ 'args' ] ] ) : target );
      
    }

    return target;

  };

  return init( target, arguments );

};

