const immutableMatchers = require('jasmine-immutable-matchers')

beforeEach(function () {
  jasmine.addMatchers(immutableMatchers)
})
