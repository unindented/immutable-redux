# Immutable Redux [![Version](https://img.shields.io/npm/v/immutable-redux.svg)](https://www.npmjs.com/package/immutable-redux) [![Build Status](https://img.shields.io/travis/unindented/immutable-redux.svg)](http://travis-ci.org/unindented/immutable-redux) [![Dependency Status](https://img.shields.io/gemnasium/unindented/immutable-redux.svg)](https://gemnasium.com/unindented/immutable-redux) [![Coverage Status](https://img.shields.io/coveralls/unindented/immutable-redux.svg)](https://coveralls.io/r/unindented/immutable-redux)

Provides utilities for dealing with [Immutable](https://facebook.github.io/immutable-js/) data structures in [Redux](http://redux.js.org/).


## Installation

To install the stable version along with Immutable and Redux, run the following:

```
$ npm install --save immutable-redux immutable redux
```

This assumes that you're using the [npm](http://npmjs.com/) package manager with a module bundler like [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/).

If you don't yet use [npm](http://npmjs.com/) or a modern module bundler, and would rather prefer a single-file [UMD](https://github.com/umdjs/umd) build that makes `ImmutableRedux` available as a global object, you can build it yourself by running the following:

```
$ npm run build
```

You'll find the development (`immutable-redux.js`) and production (`immutable-redux.min.js`) versions of the library in the `dist` folder. I *don't* recommend this approach for any serious application.


## Usage

```js
import {List} from 'immutable'
import {createStore} from 'redux'
import {combineImmutableReducers} from 'immutable-redux'

const reducer = combineImmutableReducers({
  counter: (state = 0, action) =>
    action.type === 'INCREMENT' ? state + 1 : state,
  stack: (state = List(), action) =>
    action.type === 'PUSH' ? state.push(action.payload) : state
})

let store = createStore(reducer)

store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch({type: 'INCREMENT'})
// => Map { "counter": 1, "stack": List [] }
store.dispatch({type: 'PUSH', payload: 'a'})
// => Map { "counter": 1, "stack": List [ "a" ] }
```


## Meta

* Code: `git clone git://github.com/unindented/immutable-redux.git`
* Home: <https://github.com/unindented/immutable-redux/>


## Contributors

* Daniel Perez Alvarez ([unindented@gmail.com](mailto:unindented@gmail.com))


## License

Copyright (c) 2015 Daniel Perez Alvarez ([unindented.org](https://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
