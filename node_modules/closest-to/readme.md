# closest-to
closest-to is a function that, when given a target number and an array of numbers, will return the array value closest to the target.

[![Build status](https://travis-ci.org/michaelrhodes/closest-to.png?branch=master)](https://travis-ci.org/michaelrhodes/closest-to)

[![Browser support](https://ci.testling.com/michaelrhodes/closest-to.png)](https://ci.testling.com/michaelrhodes/closest-to)

## Install
```
npm install closest-to
```

### Example
``` js
var closest = require('closest-to')

closest(10, [3, 7, 1, 9, 5])
// => 9

closest(-1.25, [2, 0, -1.5, -0.75])
// => -1.5

closest(5, [4, 6])
// => 4
```

## API
``` 
closest-to(

  target (number):
    any number

  numbers (array[number]):
    the collection of numbers you 
    want to have searched 

)
```

#### Note
As you may have noticed in the example, if two numbers are equally close to the target, the first (lowest) number is returned. It would be trivial to instead return an array, but I don’t want to add code if it’s not necessary. If this behaviour is a problem for you, please post an issue.

### License
[MIT](http://opensource.org/licenses/MIT)
